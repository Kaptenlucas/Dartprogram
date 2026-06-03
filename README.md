# Dart Scoring Platform

This is a local dart scoring platform inspired by Autodarts. The project is structured to support future development with modularity and maintainability in mind.

## Project Structure

- `backend/`: Contains the FastAPI backend code.
  - `api/`: API endpoints.
  - `database/`: Database models and setup.
  - `camera/`: Camera detection logic (not implemented).
  - `audio/`: Audio system logic (not implemented).
  - `main.py`: Application bootstrap.
- `frontend/`: Contains the React frontend code.
  - `src/`: Source code for components, pages, services, and hooks.
  - `assets/`: Assets like sounds and videos.
  - `public/`: Public static files.
  - `index.html`: Entry point for the application.
- `docs/`: Documentation (not implemented yet).

## Development

### Backend

1. Install dependencies: `pip install -r backend/requirements`
2. Run the server: `uvicorn backend.main:app --reload`

### Tests

1. Run Python unit tests from the project root:
```powershell
c:/Users/Strid/Dartprogram/.venv/Scripts/python.exe -m unittest discover backend/game_engine/tests
```
2. If your virtual environment is already active, you can instead run:
```powershell
python -m unittest discover backend/game_engine/tests
```

### Frontend

1. Install dependencies: `npm install` or `yarn install`
2. Start the development server: `npm run dev` or `yarn dev`

## Future Development

- Implement camera logic for dart detection.
- Add support for animations and sound effects.
- Develop tournament support.