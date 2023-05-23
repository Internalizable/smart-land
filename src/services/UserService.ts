export class UserService {

    public static login = async (req: any): Promise<any> => {
        const resp = await fetch('http://34.165.1.243:8000/users/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req)
        });

        if (!resp.ok) throw new Error(resp.statusText);
        return await resp.json();
    }

    public static register = async (req: any): Promise<any> => {
        const resp = await fetch('http://34.165.1.243:8000/users/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req)
        });

        console.log(resp)

        if (!resp.ok) throw new Error(resp.statusText);
        return await resp.json();
    }

}
