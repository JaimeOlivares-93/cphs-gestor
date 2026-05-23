# Servidor Web TCP Nativo en PowerShell (Sin requerir privilegios de Administrador)
$port = 3000
$ip = "192.168.1.169"

$endpoint = [System.Net.IPAddress]::Parse($ip)
$server = New-Object System.Net.Sockets.TcpListener($endpoint, $port)

Write-Host "=============================================================" -ForegroundColor Green
Write-Host " Iniciando Servidor Web TCP Nativo en:" -ForegroundColor Green
Write-Host "   -> Celular/Local: http://$($ip):$port/" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Green

try {
    $server.Start()
    Write-Host "Servidor encendido y listo. Presione Ctrl+C para detenerlo.`n" -ForegroundColor Yellow
    
    # Bucle infinito para escuchar peticiones
    while ($true) {
        $client = $server.AcceptTcpClient()
        $stream = $client.GetStream()
        
        # Leer el buffer de entrada de la petición HTTP
        $buffer = New-Object Byte[] 4096
        $bytesRead = $stream.Read($buffer, 0, $buffer.Length)
        
        if ($bytesRead -gt 0) {
            $requestStr = [System.Text.Encoding]::ASCII.GetString($buffer, 0, $bytesRead)
            
            # Obtener la primera línea del request
            $firstLine = ($requestStr -split "`r`n")[0]
            $tokens = $firstLine -split " "
            
            if ($tokens.Length -gt 1) {
                $urlPath = $tokens[1]
                
                # Ruta por defecto
                if ($urlPath -eq "/" -or $urlPath -eq "") { 
                    $urlPath = "/index.html" 
                }
                
                # Limpiar posibles query parameters
                if ($urlPath.Contains("?")) {
                    $urlPath = $urlPath.Split("?")[0]
                }
                
                # Obtener ruta absoluta del archivo
                $currentDir = Get-Location
                $filePath = Join-Path $currentDir $urlPath
                
                if (Test-Path $filePath -PathType Leaf) {
                    $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
                    
                    # Tipo MIME
                    $contentType = "application/octet-stream"
                    if ($urlPath.EndsWith(".html")) { 
                        $contentType = "text/html; charset=utf-8" 
                    } elseif ($urlPath.EndsWith(".js")) { 
                        $contentType = "application/javascript; charset=utf-8" 
                    } elseif ($urlPath.EndsWith(".css")) { 
                        $contentType = "text/css; charset=utf-8" 
                    }
                    
                    # Generar encabezados HTTP
                    $headers = "HTTP/1.1 200 OK`r`n" +
                               "Content-Type: $contentType`r`n" +
                               "Content-Length: $($fileBytes.Length)`r`n" +
                               "Connection: close`r`n" +
                               "Access-Control-Allow-Origin: *`r`n`r`n"
                               
                    $headersBytes = [System.Text.Encoding]::UTF8.GetBytes($headers)
                    
                    # Enviar respuesta al cliente
                    $stream.Write($headersBytes, 0, $headersBytes.Length)
                    $stream.Write($fileBytes, 0, $fileBytes.Length)
                } else {
                    # Archivo no encontrado (404)
                    $bodyText = "Archivo no encontrado en el Servidor"
                    $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($bodyText)
                    
                    $headers = "HTTP/1.1 404 Not Found`r`n" +
                               "Content-Type: text/plain; charset=utf-8`r`n" +
                               "Content-Length: $($bodyBytes.Length)`r`n" +
                               "Connection: close`r`n`r`n"
                               
                    $headersBytes = [System.Text.Encoding]::UTF8.GetBytes($headers)
                    $stream.Write($headersBytes, 0, $headersBytes.Length)
                    $stream.Write($bodyBytes, 0, $bodyBytes.Length)
                }
            }
        }
        
        $stream.Close()
        $client.Close()
    }
} catch {
    Write-Host "Error en el servidor TCP: $_" -ForegroundColor Red
} finally {
    $server.Stop()
    Write-Host "Servidor Web TCP detenido." -ForegroundColor Red
}
