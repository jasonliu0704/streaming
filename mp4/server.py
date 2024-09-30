import re
from fastapi import FastAPI, Request, Response, HTTPException, status
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Iterator
import os

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_video_stream(file_path: str, start: int = 0, end: int = None) -> Iterator[bytes]:
    with open(file_path, 'rb') as video:
        video.seek(start)
        remaining = end - start + 1 if end else None
        chunk_size = 1024 * 1024  # 1 MB

        while True:
            read_size = min(chunk_size, remaining) if remaining else chunk_size
            data = video.read(read_size)
            if not data:
                break
            yield data
            if remaining:
                remaining -= len(data)
                if remaining <= 0:
                    break

@app.get("/chat")
async def stream_video(request: Request):
    file_path = "video.mp4"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Video not found")

    range_header = request.headers.get('range')
    if range_header:
        byte1, byte2 = 0, None
        m = re.search(r'bytes=(\d+)-(\d*)', range_header)
        if m:
            g = m.groups()
            byte1 = int(g[0])
            if g[1]:
                byte2 = int(g[1])
        total_size = os.path.getsize(file_path)
        byte2 = byte2 if byte2 is not None else total_size - 1
        length = byte2 - byte1 + 1
        headers = {
            'Content-Range': f'bytes {byte1}-{byte2}/{total_size}',
            'Accept-Ranges': 'bytes',
            'Content-Length': str(length),
            'Content-Type': 'video/mp4',
        }
        return StreamingResponse(
            get_video_stream(file_path, byte1, byte2),
            status_code=206,
            headers=headers,
        )
    else:
        return StreamingResponse(
            get_video_stream(file_path),
            media_type="video/mp4",
        )
