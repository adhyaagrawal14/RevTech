import React, { useState, useEffect } from 'react';
import { ProductService } from '../services/productService';
import { SavedDevice, Product } from '../types';
import {
  Smartphone,
  Plus,
  Trash2,
  Wrench,
  DollarSign,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface MyDevicesPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const MyDevicesPage: React.FC<MyDevicesPageProps> = ({ onNavigate }) => {
  const products = ProductService.getAll();
  const STORAGE_KEY = 'revtech_saved_devices_v1';

  // Load from LocalStorage
  const [savedDevices, setSavedDevices] = useState<SavedDevice[]>(() => {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (item) return JSON.parse(item);
    } catch {}
    return [];
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDevices));
    } catch {}
  }, [savedDevices]);

  // Modal / Add Form State
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? '');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState(products[0]?.priceInr ?? 0);

  // Add repair log modal
  const [activeDeviceIdForRepair, setActiveDeviceIdForRepair] = useState<string | null>(null);
  const [repairComponent, setRepairComponent] = useState('');
  const [repairCost, setRepairCost] = useState(0);
  const [repairShop, setRepairShop] = useState('');
  const [repairNotes, setRepairNotes] = useState('');

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = ProductService.getById(selectedProductId);
    if (!prod) return;
    const newDev: SavedDevice = {
      id: `dev-${Date.now()}`,
      productId: prod.id,
      productName: `${prod.brand} ${prod.modelName}`,
      variant: prod.variant,
      purchaseDate,
      purchasePriceInr: Number(purchasePrice),
      loggedRepairs: [],
    };
    setSavedDevices([...savedDevices, newDev]);
    setIsAddingDevice(false);
  };

  const handleDeleteDevice = (id: string) => {
    setSavedDevices(savedDevices.filter((d) => d.id !== id));
  };

  const handleAddRepairLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDeviceIdForRepair) return;
    const newLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      component: repairComponent,
      costInr: Number(repairCost),
      serviceProvider: repairShop,
      notes: repairNotes,
    };

    setSavedDevices(
      savedDevices.map((d) =>
        d.id === activeDeviceIdForRepair
          ? { ...d, loggedRepairs: [...d.loggedRepairs, newLog] }
          : d
      )
    );
    setActiveDeviceIdForRepair(null);
  };

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#EEF5EF] rounded-3xl p-6 sm:p-8 border border-[#DCE4DC]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCE9DF] text-[#10382D] text-xs font-semibold">
              <Smartphone className="w-3.5 h-3.5 text-[#23734D]" />
              <span>Personal Hardware Garage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#10382D]">
              My Devices & Repair History
            </h1>
            <p className="text-xs sm:text-sm text-[#5D6B63] max-w-2xl">
              Track your smartphones, log actual maintenance expenses, calculate cumulative ownership cost, and access quick parts lookup. Stored locally on your browser.
            </p>
          </div>

          <button
            onClick={() => setIsAddingDevice(true)}
            className="py-2.5 px-4 rounded-xl bg-[#174C3C] hover:bg-[#10382D] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Device to Garage</span>
          </button>
        </div>
      </div>

      {/* Device List */}
      <div className="space-y-6">
        {savedDevices.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#DCE4DC] p-12 text-center max-w-md mx-auto space-y-3">
            <Smartphone className="w-10 h-10 text-[#78857D] mx-auto" />
            <h3 className="text-base font-bold text-[#10382D]">No Devices Saved Yet</h3>
            <p className="text-xs text-[#5D6B63]">
              Add your current phone to track repair records and total ownership expenses.
            </p>
            <button
              onClick={() => setIsAddingDevice(true)}
              className="py-2 px-4 rounded-xl bg-[#174C3C] text-white text-xs font-semibold"
            >
              Add First Device
            </button>
          </div>
        ) : (
          savedDevices.map((dev) => {
            const totalRepairsCost = dev.loggedRepairs.reduce((acc, curr) => acc + curr.costInr, 0);
            const totalOutlay = dev.purchasePriceInr + totalRepairsCost;
            const prod = ProductService.getById(dev.productId);

            return (
              <div
                key={dev.id}
                className="bg-white rounded-3xl border border-[#DCE4DC] p-6 shadow-xs space-y-6"
              >
                {/* Top Details */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE4DC]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#23734D] bg-[#EEF5EF] px-2 py-0.5 rounded">
                      In Your Garage
                    </span>
                    <h3 className="text-xl font-bold text-[#10382D] mt-1">{dev.productName}</h3>
                    <p className="text-xs text-[#5D6B63]">{dev.variant}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('spare-parts', { productId: dev.productId })}
                      className="py-1.5 px-3 rounded-lg bg-[#EEF5EF] text-[#174C3C] hover:bg-[#DCE9DF] text-xs font-semibold flex items-center gap-1 border border-[#DCE4DC]"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Find Parts</span>
                    </button>

                    <button
                      onClick={() => handleDeleteDevice(dev.id)}
                      className="p-2 rounded-lg text-[#78857D] hover:text-[#B42318] hover:bg-rose-50 transition-colors"
                      title="Delete Device"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Ownership Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DC]">
                    <span className="text-[#78857D] block mb-1">Purchase Date</span>
                    <span className="font-bold text-[#1B2722]">{dev.purchaseDate}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DC]">
                    <span className="text-[#78857D] block mb-1">Purchase Price</span>
                    <span className="font-bold text-[#1B2722]">
                      ₹{dev.purchasePriceInr.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DC]">
                    <span className="text-[#78857D] block mb-1">Total Repairs Logged</span>
                    <span className="font-bold text-[#174C3C]">
                      ₹{totalRepairsCost.toLocaleString('en-IN')} ({dev.loggedRepairs.length})
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#EFF3EE] border border-[#DCE4DC]">
                    <span className="text-[#78857D] block mb-1">Cumulative Outlay</span>
                    <span className="font-black text-[#10382D] text-sm">
                      ₹{totalOutlay.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Repair Logs Table */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#10382D]">
                      Maintenance & Repair Log
                    </span>
                    <button
                      onClick={() => setActiveDeviceIdForRepair(dev.id)}
                      className="text-xs font-bold text-[#23734D] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log New Repair</span>
                    </button>
                  </div>

                  {dev.loggedRepairs.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[#F8FAF7] border border-dashed border-[#DCE4DC] text-xs text-[#78857D] text-center">
                      No repairs logged yet for this device.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {dev.loggedRepairs.map((log) => (
                        <div
                          key={log.id}
                          className="p-3 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#10382D]">{log.component}</span>
                              <span className="text-[11px] text-[#78857D]">• {log.date}</span>
                            </div>
                            <p className="text-[11px] text-[#5D6B63] mt-0.5">
                              {log.serviceProvider} — {log.notes}
                            </p>
                          </div>
                          <span className="font-bold text-[#174C3C] text-sm">
                            ₹{log.costInr.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Device Modal */}
      {isAddingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#DCE4DC] p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#10382D]">Add Device to Personal Garage</h3>
            <form onSubmit={handleAddDevice} className="space-y-3">
              <div>
                <label className="font-bold text-[#5D6B63] block mb-1">Select Phone Model</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const p = ProductService.getById(e.target.value);
                    if (p) setPurchasePrice(p.priceInr);
                  }}
                  className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand} {p.modelName} ({p.variant})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#5D6B63] block mb-1">Purchase Date</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
                />
              </div>

              <div>
                <label className="font-bold text-[#5D6B63] block mb-1">Initial Price Paid (₹)</label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingDevice(false)}
                  className="py-2 px-3 rounded-lg border border-[#DCE4DC] text-[#5D6B63] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-[#174C3C] text-white font-bold"
                >
                  Save Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Repair Log Modal */}
      {activeDeviceIdForRepair && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#DCE4DC] p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#10382D]">Log Maintenance or Repair Event</h3>
            <form onSubmit={handleAddRepairLog} className="space-y-3">
              <div>
                <label className="font-bold text-[#5D6B63] block mb-1">Component Serviced</label>
                <input
                  type="text"
                  value={repairComponent}
                  onChange={(e) => setRepairComponent(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
                />
              </div>

              <div>
                <label className="font-bold text-[#5D6B63] block mb-1">Total Cost Paid (₹)</label>
                <input
                  type="number"
                  value={repairCost}
                  onChange={(e) => setRepairCost(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
                />
              </div>

              <div>
                <label className="font-bold text-[#5D6B63] block mb-1">Service Provider / Workshop</label>
                <input
                  type="text"
                  value={repairShop}
                  onChange={(e) => setRepairShop(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
                />
              </div>

              <div>
                <label className="font-bold text-[#5D6B63] block mb-1">Technician Notes</label>
                <input
                  type="text"
                  value={repairNotes}
                  onChange={(e) => setRepairNotes(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveDeviceIdForRepair(null)}
                  className="py-2 px-3 rounded-lg border border-[#DCE4DC] text-[#5D6B63] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-[#174C3C] text-white font-bold"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
