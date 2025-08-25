import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Role {
    roleId: number,
    roleName: string,
}

@Injectable({
    providedIn: 'root'
})

export class RoleService {
    private apiUrl = 'http://localhost:5156/api/Roles';

    constructor(private http: HttpClient) { }

    //get all roles
    getRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(this.apiUrl)
    }

    // Get role by id
    getRole(id: number): Observable<Role> {
        return this.http.get<Role>(`${this.apiUrl}/${id}`)
    }

    // Add role
    addRole(role: Role): Observable<Role> {
        return this.http.post<Role>(this.apiUrl, role);
    }

    // Get role by id
    updateRole(role: Role): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}?id=${role.roleId}`, role);
    }
    // Delete role
    deleteRole(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}?id=${id}`);
    }
}

