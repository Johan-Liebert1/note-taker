## Building and Running

1. Start docker 

Linux 

```sh
cd "<project directory>"
sudo systemctl start docker
docker build -t note-taking .
```

Windows and Mac

Run docker desktop

2. Run docker compose

Make sure nothing is running on host port 3000.

```sh
docker compose up
```

3. Run tests
```sh
npm test
```
