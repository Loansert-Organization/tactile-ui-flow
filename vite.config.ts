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
          
          // Map shared components/services to main project
          const mainProjectMappings = {
            'hooks/use-toast': 'src/hooks/use-toast.ts',
            'hooks/use-mobile': 'src/hooks/use-mobile.tsx', 
            'lib/utils': 'src/lib/utils.ts',
            'integrations/supabase/client': 'src/integrations/supabase/client.ts',
            'integrations/supabase/types': 'src/integrations/supabase/types.ts',
          };
          
          // Check main project mappings first
          if (mainProjectMappings[relativePath]) {
            return path.resolve(__dirname, mainProjectMappings[relativePath]);
          }
          
          // Handle UI component mappings (use main project UI)
          if (relativePath.startsWith('components/ui/')) {
            return path.resolve(__dirname, 'src', relativePath);
          }
          
          // For all other easy-momo specific imports, resolve to easy-momo src
          // This includes services, utils, hooks that are specific to easy-momo
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
