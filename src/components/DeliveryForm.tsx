import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { X } from 'lucide-react';

interface DeliveryFormData {
  address: string;
  material: string;
  documentNumber: string;
  transporter: string;
  scheduledDate: string;
  scheduledTime: string;
  customerObservations?: string;
  customerPhone: string;
  hasPickup: boolean;
  pickupItems?: string;
  deliveredMaterials?: string;
  status: string;
  isPaid: boolean;
  paymentAmount?: number;
}

interface Delivery {
  id: string;
  address: string;
  material: string;
  documentNumber: string;
  transporter: string;
  scheduledDate: string;
  scheduledTime: string;
  customerObservations?: string;
  customerPhone: string;
  hasPickup: boolean;
  pickupItems?: string;
  deliveredMaterials?: string;
  status: string;
  isPaid: boolean;
  paymentAmount?: number;
}

interface DeliveryFormProps {
  delivery?: Delivery | null;
  onClose: () => void;
  onSave: () => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ delivery, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<DeliveryFormData>();
  const watchHasPickup = watch('hasPickup');
  const watchIsPaid = watch('isPaid');

  useEffect(() => {
    if (delivery) {
      reset(delivery);
    } else {
      // Valores por defecto para nueva entrega
      reset({
        hasPickup: false,
        isPaid: true,
        status: 'PREPARACION'
      });
    }
  }, [delivery, reset]);

  const onSubmit = async (data: DeliveryFormData) => {
    setLoading(true);
    try {
      // Asegurar que el estado tenga un valor por defecto
      const deliveryData = {
        ...data,
        status: data.status || 'PREPARACION'
      };
      
      console.log('Enviando datos:', deliveryData); // Debug
      
      if (delivery) {
        await axios.put(`/api/deliveries/${delivery.id}`, deliveryData);
      } else {
        await axios.post('/api/deliveries', deliveryData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving delivery:', error);
      alert('Error al guardar la entrega. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'PREPARACION', label: 'Preparación' },
    { value: 'TRANSITO', label: 'Tránsito' },
    { value: 'REPARTO', label: 'Reparto' },
    { value: 'ERROR_LLAMADA', label: 'Error al llamar' },
    { value: 'AUSENTE', label: 'Ausente' },
    { value: 'ERROR_PEDIDO', label: 'Error en pedido' },
    { value: 'COMPLETADO', label: 'Completado' },
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
      <div className="relative top-0 sm:top-8 mx-auto max-w-2xl bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {delivery ? 'Editar Entrega' : 'Nueva Entrega'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {delivery ? 'Modifica los datos de la entrega' : 'Completa todos los campos requeridos'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Información Básica */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de Entrega *
                </label>
                <input
                  type="text"
                  {...register('address', { required: 'La dirección es requerida' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ej: Calle Mayor 123, Madrid"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material/Producto *
                </label>
                <input
                  type="text"
                  {...register('material', { required: 'El material es requerido' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ej: Sofá 3 plazas"
                />
                {errors.material && <p className="text-red-500 text-sm mt-1">{errors.material.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Documento *
                </label>
                <input
                  type="text"
                  {...register('documentNumber', { required: 'El número de documento es requerido' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ej: 12345678A"
                />
                {errors.documentNumber && <p className="text-red-500 text-sm mt-1">{errors.documentNumber.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transportista *
                </label>
                <input
                  type="text"
                  {...register('transporter', { required: 'El transportista es requerido' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ej: Juan Pérez"
                />
                {errors.transporter && <p className="text-red-500 text-sm mt-1">{errors.transporter.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono del Cliente *
                </label>
                <input
                  type="tel"
                  {...register('customerPhone', { required: 'El teléfono es requerido' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ej: 666123456"
                />
                {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone.message}</p>}
              </div>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Programación</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Entrega *
                </label>
                <input
                  type="date"
                  {...register('scheduledDate', { required: 'La fecha es requerida' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {errors.scheduledDate && <p className="text-red-500 text-sm mt-1">{errors.scheduledDate.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de Entrega *
                </label>
                <input
                  type="time"
                  {...register('scheduledTime', { required: 'La hora es requerida' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {errors.scheduledTime && <p className="text-red-500 text-sm mt-1">{errors.scheduledTime.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado *
                </label>
                <select
                  {...register('status', { required: 'El estado es requerido' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
              </div>
            </div>
          </div>

          {/* Pago */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Información de Pago</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isPaid')}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-3 text-sm font-medium text-gray-900">
                  Está pagado
                </label>
              </div>
              
              {!watchIsPaid && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad a Cobrar (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('paymentAmount', { 
                      valueAsNumber: true,
                      min: { value: 0, message: 'La cantidad debe ser positiva' }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  {errors.paymentAmount && <p className="text-red-500 text-sm mt-1">{errors.paymentAmount.message}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Recogida */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Recogida</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('hasPickup')}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-3 text-sm font-medium text-gray-900">
                  Incluye recogida de material
                </label>
              </div>

              {watchHasPickup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material a Recoger
                  </label>
                  <input
                    type="text"
                    {...register('pickupItems')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Ej: Sofá viejo, colchón usado"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Observaciones</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones del Cliente
              </label>
              <textarea
                {...register('customerObservations')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Instrucciones especiales, notas adicionales..."
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material Entregado (si aplica)
              </label>
              <input
                type="text"
                {...register('deliveredMaterials')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Material que se entregó al cliente"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : delivery ? 'Actualizar Entrega' : 'Crear Entrega'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryForm;
