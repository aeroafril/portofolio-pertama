import { NextResponse } from "next/server";

export async function GET() {
    try{
        const res = await fetch("https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=31.71.03.1001");
        const data = await res.json();

        return NextResponse.json(data);
    }   catch(error){
        return NextResponse.json(
            {message: "Gagal mengambil data cuaca"},
            {status: 500}
        );
    }
}