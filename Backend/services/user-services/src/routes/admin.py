from src.utils.auth import hash_password
from src.schemas.request import AddStudentRequest, CouncilListRequest, UpdateCouncilRequest, DeleteCouncilRequest, AddCouncilRequest
from src.models.users import Admin, Council, Student
from src.database.connection import get_users_db
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

router = APIRouter()

@router.post("/student/add")
def add_student(request: AddStudentRequest, db: Session = Depends(get_users_db)):
    name=request.name
    full_name=request.full_name
    email = request.email
    password=request.password
    request_by = request.request_by
    password_hash = hash_password(password)
    try:
        existing_admin = db.query(Admin).filter(Admin.email == request_by).first()
        if not existing_admin:
            return JSONResponse(content={"type": "error", "details": "Admin authorization required"},
                                status_code=403)
        existing_student = db.query(Student).filter(Student.email == email).first()
        if existing_student:
            return JSONResponse(
                content={"type": "error", "details": "Student already exists"},
                status_code=400
            )
        new_student = Student(
            name=name,
            full_name=full_name,
            email=email,
            password_hash=password_hash,
        )
        db.add(new_student)
        db.commit()
        db.refresh(new_student)
        return JSONResponse(
            content={
                "type": "ok",
                "details": "Student created successfully",
                "student": {
                    "id": new_student.id,
                    "email": new_student.email,
                    "name": new_student.name
                }
            },
            status_code=201
        )

    except Exception as e:
        db.rollback()
        print("Error adding student:", e)
        return JSONResponse(
            content={"type": "error", "details": "Failed to create student"},
            status_code=500
        )

@router.post("/council/add")
def add_council(request: AddCouncilRequest, db: Session = Depends(get_users_db)):
    email=request.email
    password=request.password
    password_hash = hash_password(password)
    name=request.name
    title=request.title
    description=request.description
    faculty_advisor=request.faculty_advisor
    secretary=request.secretary
    deputy=request.deputy
    request_by = request.request_by
    try:
        existing_admin = db.query(Admin).filter(Admin.email == request_by).first()
        if not existing_admin:
            return JSONResponse(
                content={"type": "error", "details": "Admin authorization required"},
                status_code=403
            )
        existing_secretary = db.query(Student).filter(Student.email == secretary).first()
        if not existing_secretary:
            return JSONResponse(
                content={"type": "error", "details": "Secretary student not found"},
                status_code=404
            )
        deputy_students = []
        for deputy_email in deputy:
            existing_deputy = db.query(Student).filter(Student.email == deputy_email).first()
            if not existing_deputy:
                return JSONResponse(
                    content={"type": "error", "details": f"Deputy {deputy_email} not found"},
                    status_code=404
                )
            deputy_students.append(existing_deputy)
        new_council = Council(
            email=email,
            password_hash=password_hash,
            name=name,
            title=title,
            description=description,
            faculty_advisor=faculty_advisor,
            secretary_id=existing_secretary.id,
            secretary=existing_secretary,
            deputy_ids=deputy_students
        )
        db.add(new_council)
        db.commit()
        db.refresh(new_council)
        return JSONResponse(
            content={
                "type": "ok",
                "details": "Council created successfully",
                "council": {
                    "id": new_council.id,
                    "name": new_council.name,
                    "email": new_council.email
                }
            },
            status_code=201
        )
    except Exception as e:
        db.rollback()
        print("Error adding council:", e)
        return JSONResponse(
            content={"type": "error", "details": "Failed to create council"},
            status_code=500
        )

@router.post("/council/update")
def update_council(request: UpdateCouncilRequest, db: Session = Depends(get_users_db)):
    try:
        admin = db.query(Admin).filter(Admin.email == request.request_by).first()
        if not admin:
            return JSONResponse(
                content={"type": "error", "details": "Admin authorization required"},
                status_code=403
            )
        council = db.query(Council).filter(Council.id == request.council_id).first()
        if not council:
            return JSONResponse(
                content={"type": "error", "details": "Council not found"},
                status_code=404
            )
        secretary = db.query(Student).filter(Student.email == request.secretary).first()
        if not secretary:
            return JSONResponse(
                content={"type": "error", "details": "Secretary student not found"},
                status_code=404
            )
        new_deputies = []
        for deputy_email in request.deputy:
            deputy = db.query(Student).filter(Student.email == deputy_email).first()
            if not deputy:
                return JSONResponse(
                    content={"type": "error", "details": f"Deputy {deputy_email} not found"},
                    status_code=404
                )
            new_deputies.append(deputy)
        council.email=request.email
        council.password_hash=hash_password(request.password)
        council.name=request.name
        council.title=request.title
        council.description=request.description
        council.faculty_advisor=request.faculty_advisor
        council.secretary_id=secretary.id
        council.deputy_ids=new_deputies
        db.commit()
        return JSONResponse(
            content={
                "type": "ok",
                "details": "Council updated successfully",
                "council": {
                    "id": council.id,
                    "name": council.name
                }
            }
        )

    except Exception as e:
        db.rollback()
        print("Error updating council:", e)
        return JSONResponse(
            content={"type": "error", "details": "Failed to update council"},
            status_code=500
        )

@router.post("/council/list")
def councils_list(request: CouncilListRequest, db: Session = Depends(get_users_db)):
    try:
        admin = db.query(Admin).filter(Admin.email == request.request_by).first()
        if not admin:
            return JSONResponse(
                content={"type": "error", "details": "Admin authorization required"},
                status_code=403
            )

        councils = db.query(Council).options(
            joinedload(Council.secretary),
            joinedload(Council.deputy_ids)
        ).all()

        councils_data = []
        for council in councils:
            council_data = {
                'id': council.id,
                'email': council.email,
                'name': council.name,
                'title': council.title,
                'description': council.description,
                'faculty_advisor': council.faculty_advisor,
                'secretary': council.secretary.email if council.secretary else None,
                'deputies': [d.email for d in council.deputy_ids],
                'website': council.website,
                'created_at': council.created_at.isoformat(),
                'updated_at': council.updated_at.isoformat()
            }
            councils_data.append(council_data)
        return JSONResponse(
            content={
                "type": "ok",
                "details": f"Found {len(councils_data)} councils",
                "councils": councils_data,
                "count": len(councils_data)
            }
        )
    except Exception as e:
        print("Error listing councils:", e)
        return JSONResponse(
            content={"type": "error", "details": "Failed to retrieve councils"},
            status_code=500
        )

@router.post("/council/delete")
def delete_council(request: DeleteCouncilRequest, db: Session = Depends(get_users_db)):
    id=request.id
    request_by=request.request_by
    try:
        existing_admin = db.query(Admin).filter(Admin.email == request_by).first()
        if not existing_admin:
            return JSONResponse(
                content={"type": "error", "details": "Admin authorization required"},
                status_code=403
            )
        existing_council = db.query(Council).filter(Council.id == id).first()
        if not existing_council:
            return JSONResponse(
                content={"type": "error", "details": "Council not found"},
                status_code=404
            )
        db.delete(existing_council)
        db.commit()
        return JSONResponse(
            content={
                "type": "ok",
                "details": "Council deleted successfully",
                "deleted_id": request.id
            }
        )
    except Exception as e:
        db.rollback()
        print("Error deleting council:", e)
        return JSONResponse(
            content={"type": "error", "details": "Failed to delete council"},
            status_code=500
        )
    

