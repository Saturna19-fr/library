from flask import Blueprint, redirect
#auth/global authorization services
auth_bp = Blueprint('auth', __name__, url_prefix="/auth/gas/")

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    return redirect("/")
    # Add your login logic here
    pass

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    # Add your register logic here
    return redirect("/")

    pass

@auth_bp.route('/logout')
def logout():
    return redirect("/")

    # Add your logout logic here
    pass