import React, { useMemo } from 'react';
import FriDashboardLayout from '@/components/fri/FriDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { workshopModules } from '@/data/workshopModules';
import { useFriModules } from '@/hooks/useFriModules';

export function FriModulesPage() {
  const { modules, isLoading, error, setModule, isUpdating } = useFriModules();

  const enabledModuleIds = useMemo(() => {
    return new Set(modules.filter((module) => module.status === 'active').map((module) => module.module_id));
  }, [modules]);

  const stats = useMemo(() => {
    const enabledCount = workshopModules.filter((module) => enabledModuleIds.has(module.id)).length;
    const readyCount = workshopModules.filter((module) => module.status === 'Klar').length;
    return { enabledCount, readyCount };
  }, [enabledModuleIds]);

  return (
    <FriDashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-white">Moduler</h1>
          <p className="text-white/60 mt-2">
            Aktiver de moduler dit værksted har brug for – og udvid når I er klar.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 rounded-lg p-4 text-sm">
            {error.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-sm text-white/60">Aktive moduler</p>
            <p className="text-2xl font-semibold text-white mt-2">{stats.enabledCount}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-sm text-white/60">Klar til aktivering</p>
            <p className="text-2xl font-semibold text-white mt-2">{stats.readyCount}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-sm text-white/60">Total moduler</p>
            <p className="text-2xl font-semibold text-white mt-2">{workshopModules.length}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {workshopModules.map((module) => {
            const isEnabled = enabledModuleIds.has(module.id);
            return (
              <Card key={module.id} className="bg-white/5 border border-white/10 text-white">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-white">{module.name}</CardTitle>
                    <span className="text-xs px-2 py-1 rounded-full border border-white/15 text-white/70">
                      {module.status}
                    </span>
                  </div>
                  <CardDescription className="text-white/60">{module.tag}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-white/70">{module.description}</p>
                  <ul className="text-xs text-white/60 space-y-1">
                    {module.highlights.slice(0, 3).map((highlight) => (
                      <li key={highlight}>• {highlight}</li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between gap-3">
                    <span className={isEnabled ? 'text-emerald-300 text-xs' : 'text-white/50 text-xs'}>
                      {isEnabled ? 'Aktiveret' : 'Ikke aktiveret'}
                    </span>
                    <Button
                      size="sm"
                      variant={isEnabled ? 'outline' : 'default'}
                      className={isEnabled ? 'border-white/20 text-white hover:bg-white/10' : 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black hover:brightness-110'}
                      onClick={() => setModule({ moduleId: module.id, enabled: !isEnabled })}
                      disabled={module.status !== 'Klar' || isUpdating || isLoading}
                    >
                      {isLoading ? 'Indlæser...' : module.status === 'Klar' ? (isEnabled ? 'Deaktiver' : 'Aktiver') : 'Book demo'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </FriDashboardLayout>
  );
}
