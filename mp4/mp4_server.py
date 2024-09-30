import asyncio
import websockets
import os
import struct

async def video_stream(websocket, path):
    video_file = 'video.mp4'  # Replace with your video file
    command = [
        'ffmpeg',
        '-stream_loop', '2',  # Loop the video 2 additional times (total 3 plays)
        '-re',
        '-i', video_file,
        '-c:v', 'copy',
        '-c:a', 'copy',
        '-f', 'mp4',
        '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
        'pipe:1'
    ]
    process = await asyncio.create_subprocess_exec(
        *command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )

    try:
        while True:
            # Read from FFmpeg's stdout until we get a full fragment
            # We'll use the mp4 file's box structure to read complete fragments
            size_bytes = await process.stdout.readexactly(4)
            if not size_bytes:
                break
            size = struct.unpack('>I', size_bytes)[0]
            data = size_bytes + await process.stdout.readexactly(size - 4)
            await websocket.send(data)
    except asyncio.IncompleteReadError:
        pass
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
    finally:
        process.kill()
        await process.wait()

async def main():
    async with websockets.serve(video_stream, "localhost", 8765, max_size=None):
        print("Server started at ws://localhost:8765")
        await asyncio.Future()  # Run forever

if __name__ == '__main__':
    asyncio.run(main())
