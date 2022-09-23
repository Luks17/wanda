
export function newRandomId(idLength: number): string {
    let id: string = ""; 
    const characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for(let i = 0; i < idLength; i++) {
        id = id + characters.charAt(Math.floor(Math.random() * 36));
    }

    return id;
}
