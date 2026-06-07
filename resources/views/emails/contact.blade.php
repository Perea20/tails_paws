<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nuevo Mensaje de Contacto</title>
</head>
<body style="font-family: sans-serif; background-color: #f3f4f6; padding: 20px; color: #1f2937;">

    <div style="max-w: 600px; margin: 0 auto; bg-color: #ffffff; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        
        <h2 style="color: #047857; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            🐾 Nuevo mensaje desde la Web
        </h2>

        <p style="margin: 10px 0;"><strong>Nombre del cliente:</strong> {{ $data['name'] }}</p>
        <p style="margin: 10px 0;"><strong>Email de contacto:</strong> <a href="mailto:{{ $data['email'] }}" style="color: #047857;">{{ $data['email'] }}</a></p>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-left: 4px solid #047857; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; margin-bottom: 8px; color: #4b5563;">Mensaje enviado:</p>
            <p style="margin: 0; line-height: 1.5; white-space: pre-line;">{{ $data['message'] }}</p>
        </div>

        <p style="font-size: 11px; color: #9ca3af; margin-top: 30px; text-align: center; font-style: italic;">
            Este correo ha sido generado automáticamente por el formulario de contacto de Tails & Paws.
        </p>
    </div>

</body>
</html>