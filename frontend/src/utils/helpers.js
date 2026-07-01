export const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const generateWhatsAppMessage = (items, total, config) => {
  const phone = config?.whatsappNegocio || '573012558773';
  let message = 'Hola, quiero realizar el siguiente pedido:\n\n';

  items.forEach((item, index) => {
    message += `${index + 1}. *${item.nombre}*\n`;
    message += `   Cantidad: ${item.cantidad}\n`;
    message += `   Precio unitario: ${formatCurrency(item.precioVenta)}\n`;
    if (item.descuentoPorcentaje > 0) {
      message += `   Descuento: ${item.descuentoPorcentaje}%\n`;
      message += `   Subtotal: ${formatCurrency(item.precioConDescuento * item.cantidad)}\n`;
    }
    message += '\n';
  });

  message += `💰 *Total: ${formatCurrency(total)}*\n\n`;
  message += 'Por favor confirmar disponibilidad.';

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
};

export const getStockStatus = (stockActual, stockMinimo) => {
  if (stockActual === 0) return { label: 'Agotado', color: 'error' };
  if (stockActual <= stockMinimo) return { label: 'Bajo Stock', color: 'warning' };
  return { label: 'Disponible', color: 'success' };
};
