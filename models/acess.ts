export interface Access {
  id: number;
  id_usuario?: number;       
  id_invitacion?: number;      
  id_punto: number;             
  fecha_acceso?: string;     
  exitoso: boolean;           
  tipo_acceso?: string;         
  tipo_validacion?: string;   
  motivo_rechazo?: string;
  punto_nombre: string;       
  identificacion_usuario?: string;
  matricula_identificacion?: string;
  qr_code?: string;
}
