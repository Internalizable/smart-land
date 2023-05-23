export class PlantService {

    public static fetchPlants = async (token: string | undefined): Promise<any> => {
        const resp = await fetch('http://34.165.1.243:8000/plants/', {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
            },
        });
        if (!resp.ok) throw new Error(resp.statusText);
        return await resp.json();
    };

    public static getPlant = async (token: string | undefined, plantId: string, dataLimit: number,): Promise<any> => {
        const resp = await fetch(
            `http://34.165.1.243:8000/plants/${plantId}?limit=${dataLimit}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
            },
        );

        if (!resp.ok) throw new Error(resp.statusText);

        return await resp.json();
    };

}
