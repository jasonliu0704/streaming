install
pip install asyncio
pip install websockets

run:
python mp4_server.py
python -m http.server 8000
go to localhost:8000

Option 1: Use Media Source Extensions (MSE) with Fragmented MP4 (fMP4) Segments
Overview
Media Source Extensions (MSE) allow JavaScript to feed media data (audio and video) directly to a HTML5 <video> element.
By segmenting your video into small chunks (e.g., fMP4 fragments), you can stream these over WebSocket or HTTP and append them to the media source on the client.
This approach maintains synchronization between audio and video.
Implementation Steps
Transmux Video to fMP4 Segments

Use a tool like FFmpeg to segment the video into fMP4 fragments.
Alternatively, use a Python library to read and segment the video file.
Stream Segments over WebSocket

The server reads segments and sends them over WebSocket to the client.
Ensure you send both audio and video data in the segments.
Client-Side Media Source Extensions

On the client, use MSE to create a MediaSource object.
Append the received segments to the SourceBuffer associated with the MediaSource.