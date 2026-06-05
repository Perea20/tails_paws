<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; color: #333; line-height: 1.6; }
        .button { background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>¡Hola, {{ $client->name }}!</h2>
        <p>Te hemos dado de alta en el sistema de la clínica veterinaria <strong>Tails & Paws</strong>.</p>
        <p>Para poder gestionar las citas de tus mascotas y ver su historial, necesitas activar tu cuenta estableciendo tu contraseña privada haciendo clic en el siguiente botón:</p>
        
        <p style="margin: 30px 0;">
            <a href="{{ $activationUrl }}" class="button" style="color: white;">Configurar mi Contraseña</a>
        </p>

        <p>Si el botón no funciona, copia y pega, o haz click en este enlace:</p>
        <p style="font-size: 12px; color: #666;">{{ $activationUrl }}</p>

        <hr style="border: none; border-top: 1px solid #eee; margin-top: 40px;">
        <p style="font-size: 12px; color: #999;">Este enlace expirará en 60 minutos.</p>
    </div>
</body>
</html>