import React, { useState, useEffect } from 'react';
import { Globe, Edit, Trash2, Plus, Search, Phone } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Country {
  id: string;
  code: string;
  name: string;
  currency: string;
  currency_symbol: string;
  phone_prefix: string;
  momo_prefix: string;
  is_active: boolean;
  created_at: string;
}

const AdminCountries: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    currency: '',
    currency_symbol: '',
    phone_prefix: '',
    momo_prefix: '',
    is_active: true
  });

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCountries(data || []);
    } catch (error: any) {
      console.error('[ADMIN_COUNTRIES] Fetch error:', error);
      toast.error('Failed to load countries');
    } finally {
      setLoading(false);
    }
  };

  const saveCountry = async () => {
    try {
      if (editingCountry) {
        // Update existing country
        const { error } = await supabase
          .from('countries')
          .update(formData)
          .eq('id', editingCountry.id);

        if (error) throw error;
        toast.success('Country updated successfully');
      } else {
        // Create new country
        const { error } = await supabase
          .from('countries')
          .insert([formData]);

        if (error) throw error;
        toast.success('Country created successfully');
      }

      fetchCountries();
      resetForm();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('[ADMIN_COUNTRIES] Save error:', error);
      toast.error('Failed to save country');
    }
  };

  const deleteCountry = async (countryId: string) => {
    try {
      const { error } = await supabase
        .from('countries')
        .delete()
        .eq('id', countryId);

      if (error) throw error;
      toast.success('Country deleted successfully');
      fetchCountries();
    } catch (error: any) {
      console.error('[ADMIN_COUNTRIES] Delete error:', error);
      toast.error('Failed to delete country');
    }
  };

  const toggleCountryStatus = async (countryId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('countries')
        .update({ is_active: !isActive })
        .eq('id', countryId);

      if (error) throw error;
      toast.success(`Country ${!isActive ? 'activated' : 'deactivated'}`);
      fetchCountries();
    } catch (error: any) {
      console.error('[ADMIN_COUNTRIES] Status toggle error:', error);
      toast.error('Failed to update country status');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      currency: '',
      currency_symbol: '',
      phone_prefix: '',
      momo_prefix: '',
      is_active: true
    });
    setEditingCountry(null);
  };

  const openEditDialog = (country: Country) => {
    setEditingCountry(country);
    setFormData({
      code: country.code,
      name: country.name,
      currency: country.currency,
      currency_symbol: country.currency_symbol,
      phone_prefix: country.phone_prefix,
      momo_prefix: country.momo_prefix,
      is_active: country.is_active
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCountries = countries.filter(c => c.is_active).length;

  if (loading) {
    return <GlassCard className="p-6">Loading countries...</GlassCard>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Country Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            {activeCountries} active / {countries.length} total
          </Badge>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Country
          </Button>
        </div>
      </div>

      {/* Search */}
      <GlassCard className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search countries by name, code, or currency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </GlassCard>

      {/* Countries Table */}
      <GlassCard className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Phone Prefix</TableHead>
              <TableHead>MoMo Prefix</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCountries.map((country) => (
              <TableRow key={country.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <p className="font-medium">{country.name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{country.code}</Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{country.currency}</p>
                    <p className="text-xs text-muted-foreground">{country.currency_symbol}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{country.phone_prefix}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{country.momo_prefix}</code>
                </TableCell>
                <TableCell>
                  <Badge variant={country.is_active ? 'default' : 'secondary'}>
                    {country.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openEditDialog(country)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleCountryStatus(country.id, country.is_active)}
                    >
                      {country.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Country</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {country.name}? This action cannot be undone and may affect existing users.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteCountry(country.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GlassCard>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCountry ? 'Edit Country' : 'Add New Country'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Country Code</label>
                <Input
                  placeholder="RW"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Country Name</label>
                <Input
                  placeholder="Rwanda"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Currency</label>
                <Input
                  placeholder="RWF"
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value.toUpperCase()})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Currency Symbol</label>
                <Input
                  placeholder="₣"
                  value={formData.currency_symbol}
                  onChange={(e) => setFormData({...formData, currency_symbol: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Phone Prefix</label>
                <Input
                  placeholder="+250"
                  value={formData.phone_prefix}
                  onChange={(e) => setFormData({...formData, phone_prefix: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">MoMo Prefix</label>
                <Input
                  placeholder="*182"
                  value={formData.momo_prefix}
                  onChange={(e) => setFormData({...formData, momo_prefix: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              />
              <label htmlFor="is_active" className="text-sm font-medium">Active</label>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={saveCountry} className="flex-1">
                {editingCountry ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {filteredCountries.length === 0 && !loading && (
        <GlassCard className="p-12 text-center">
          <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No countries found matching your criteria.</p>
        </GlassCard>
      )}
    </div>
  );
};

export default AdminCountries; 