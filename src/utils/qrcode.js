import QRCode from "qrcode"

export async function generateQrcode(data) {
    const result = QRCode.toDataURL(JSON.stringify(data))
    return result
}

