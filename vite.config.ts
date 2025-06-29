import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    // Custom plugin to handle easy-momo path resolution
    {
      name: 'easy-momo-resolver',
      resolveId(id, importer) {
        // Handle "@/" imports from easy-momo files
        if (id.startsWith('@/') && importer && importer.includes('features/easy-momo/')) {
          const relativePath = id.replace('@/', '');
          
          // Map specific easy-momo imports to main project equivalents
          const exactMappings = {
            'hooks/use-toast': 'src/hooks/use-toast.ts',
            'hooks/use-mobile': 'src/hooks/use-mobile.tsx', 
            'lib/utils': 'src/lib/utils.ts',
            'integrations/supabase/client': 'src/integrations/supabase/client.ts',
            'integrations/supabase/types': 'src/integrations/supabase/types.ts',
          };
          
          // Check exact mappings first
          if (exactMappings[relativePath]) {
            return path.resolve(__dirname, exactMappings[relativePath]);
          }
          
          // Handle UI component mappings
          if (relativePath.startsWith('components/ui/')) {
            return path.resolve(__dirname, 'src', relativePath);
          }
          
          // For other easy-momo specific imports, resolve to easy-momo src
          return path.resolve(__dirname, 'features/easy-momo/src', relativePath);
        }
        return null;
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
