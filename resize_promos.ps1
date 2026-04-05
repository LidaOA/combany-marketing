Add-Type -AssemblyName System.Drawing

function Resize-Image {
    param (
        [string]$SourcePath,
        [string]$DestinationPath,
        [int]$Width,
        [int]$Height
    )

    if (-Not (Test-Path $SourcePath)) {
        Write-Error "File not found: $SourcePath"
        return
    }

    $img = [System.Drawing.Image]::FromFile($SourcePath)
    $bmp = New-Object System.Drawing.Bitmap($Width, $Height)
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $graph.DrawImage($img, 0, 0, $Width, $Height)
    $bmp.Save($DestinationPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $graph.Dispose()
    $bmp.Dispose()
    $img.Dispose()

    Write-Output "Successfully resized to $Width x $Height : $DestinationPath"
}

Resize-Image -SourcePath "D:\Python_Projects\combany\marketing\export_png\6_promo_small.png" -DestinationPath "D:\Python_Projects\combany\marketing\export_png\6_promo_small_440x280.png" -Width 440 -Height 280
Resize-Image -SourcePath "D:\Python_Projects\combany\marketing\export_png\7_promo_large.png" -DestinationPath "D:\Python_Projects\combany\marketing\export_png\7_promo_large_1400x560.png" -Width 1400 -Height 560
