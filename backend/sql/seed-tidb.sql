USE negocio_perfumes;

INSERT INTO usuario (nombre, correo, contrasena, rol) VALUES
('Administrador', 'admin@negocio.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SUPER_ADMIN');

INSERT INTO categoria (nombre, descripcion) VALUES
('Perfumes', 'Fragancias exclusivas para hombre y mujer'),
('Lociones', 'Lociones corporales y after shave'),
('Crema de Manos', 'Cuidado y protección para tus manos'),
('Crema Facial', 'Tratamiento facial premium'),
('Accesorios', 'Accesorios de belleza y cuidado personal');

INSERT INTO marca (nombre, descripcion) VALUES
('Carolina Herrera', 'Marca de lujo española'),
('Dior', 'Casa de moda francesa'),
('Chanel', 'Moda y fragancias de alta costura'),
('Versace', 'Moda italiana de lujo'),
('Calvin Klein', 'Moda contemporánea'),
('Nivea', 'Cuidado personal alemán'),
('L''Oréal', 'Belleza global'),
('Dove', 'Cuidado personal suave');

INSERT INTO productos (nombre, descripcion, categoria_id, marca_id, precio_compra, precio_venta, descuento_porcentaje, stock_actual, stock_minimo) VALUES
('Good Girl Carolina Herrera', 'Fragancia femenina intensa y seductora con notas de jazmín y cacao', 1, 1, 280000, 450000, 10, 25, 5),
('Sauvage Dior', 'Fragancia masculina fresca y aromática con bergamota y lavanda', 1, 2, 320000, 520000, 5, 30, 5),
('Montale Arabians Tonka', 'Montale Arabians Tonka Eau de Parfum 100ml. Fragancia oriental intensa con notas de tonka, bergamota, azafrán, oud, rosa búlgara, ámbar, musgo de roble y almizcle blanco.', 1, 4, 350000, 580000, 0, 15, 5),
('Eros Versace', 'Fragancia masculina vibrante con menta y vainilla', 1, 4, 250000, 400000, 15, 20, 5),
('Euphoria Calvin Klein', 'Misteriosa y sensual con notas de granada y orquídea', 1, 5, 200000, 350000, 0, 8, 5),
('Agua de Body Splash Dior', 'Refrescante loción corporal para el día', 2, 2, 120000, 200000, 10, 40, 10),
('Versace Pour Homme', 'Loción fresca para hombre con notas acuáticas', 2, 4, 150000, 250000, 0, 35, 10),
('Crema Manos Nivea', 'Hidratación intensa con aceite de almendras', 3, 6, 15000, 35000, 20, 100, 20),
('Crema Facial Dove', 'Nutrición profunda con nutrientes Naturales', 4, 8, 25000, 55000, 0, 50, 10),
('Set de Brochas L''Oréal', 'Kit profesional de maquillaje con 12 piezas', 5, 7, 80000, 150000, 5, 12, 5);

INSERT INTO imagenes_producto (producto_id, url_imagen, principal) VALUES
(1, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', true),
(2, 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400', true),
(3, 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400', true),
(4, 'https://images.unsplash.com/photo-1594035910387-fa3192f3d8d4?w=400', true),
(5, 'https://images.unsplash.com/photo-1592945569654-4b4e4b4b4b4b?w=400', true);

INSERT INTO movimientos_inventario (producto_id, tipo_movimiento, cantidad, observacion, fecha) VALUES
(1, 'ENTRADA', 30, 'Compra inicial de mercancía', '2026-01-15 10:00:00'),
(2, 'ENTRADA', 35, 'Compra inicial de mercancía', '2026-01-15 10:00:00'),
(3, 'ENTRADA', 20, 'Compra inicial de mercancía', '2026-01-15 10:00:00'),
(4, 'ENTRADA', 25, 'Compra inicial de mercancía', '2026-01-15 10:00:00'),
(5, 'ENTRADA', 15, 'Compra inicial de mercancía', '2026-01-15 10:00:00'),
(1, 'SALIDA', 5, 'Venta en tienda', '2026-02-01 14:30:00'),
(2, 'SALIDA', 5, 'Venta en tienda', '2026-02-01 14:30:00'),
(8, 'ENTRADA', 100, 'Compra por volumen', '2026-02-10 09:00:00'),
(8, 'SALIDA', 20, 'Venta online', '2026-03-01 11:00:00'),
(9, 'ENTRADA', 50, 'Restock', '2026-03-05 16:00:00');

INSERT INTO configuracion (whatsapp_negocio, nombre_tienda, logo, banner_principal) VALUES
('573012558773', 'Eros De Nuit Parfums', 'https://via.placeholder.com/150', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1200');

INSERT INTO ventas (cliente_nombre, cliente_telefono, total, estado, observacion, fecha_venta) VALUES
('María García', '573001112233', 485000, 'FINALIZADA', 'Compra de 2 productos', '2026-01-20 10:00:00'),
('Carlos López', '573002223344', 520000, 'FINALIZADA', 'Sauvage Dior', '2026-01-22 15:30:00'),
('Ana Martínez', '573003334455', 450000, 'EN_PROCESO', 'Pendiente de envío', '2026-02-05 09:15:00'),
('Pedro Sánchez', '573004445566', 1205000, 'PENDIENTE', 'Esperando confirmación de pago', '2026-02-10 11:00:00'),
('Laura Rodríguez', '573005556677', 340000, 'FINALIZADA', 'Crema facial + crema manos', '2026-03-01 14:00:00'),
('Diego Torres', '573006667788', 1270000, 'EN_PROCESO', 'Pedido grande - 3 perfumes', '2026-03-10 08:45:00'),
('Sofía Ramírez', '573007778899', 450000, 'PENDIENTE', 'Good Girl Carolina Herrera', '2026-03-15 16:20:00'),
('Andrés Moreno', '573008889900', 1105000, 'CANCELADA', 'Cliente canceló el pedido', '2026-03-20 10:30:00');

INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, 450000, 450000),
(1, 8, 1, 35000, 35000),
(2, 2, 1, 520000, 520000),
(3, 1, 1, 450000, 450000),
(4, 3, 1, 580000, 580000),
(4, 8, 3, 35000, 105000),
(4, 9, 2, 55000, 110000),
(5, 9, 1, 55000, 55000),
(5, 7, 1, 250000, 250000),
(5, 8, 1, 35000, 35000),
(6, 4, 1, 400000, 400000),
(6, 5, 1, 350000, 350000),
(6, 2, 1, 520000, 520000),
(7, 1, 1, 450000, 450000),
(8, 6, 5, 200000, 1000000),
(8, 8, 3, 35000, 105000);

INSERT INTO combo (nombre, descripcion, precio_combo, imagen_url, activo) VALUES
('Combo Romántico', 'Good Girl + Crema Manos Nivea', 420000, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', true),
('Combo Regalo', 'Sauvage Dior + Crema Facial Dove', 530000, 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400', true),
('Combo Elegancia', 'Montale Arabians Tonka + Eros Versace', 900000, 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400', true);

INSERT INTO combo_producto (combo_id, producto_id, cantidad) VALUES
(1, 1, 1),
(1, 8, 1),
(2, 2, 1),
(2, 9, 1),
(3, 3, 1),
(3, 4, 1);
