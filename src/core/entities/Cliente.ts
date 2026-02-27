export class Cliente {
    constructor(
        private readonly _id: number,
        private _nombre: string,
        private _apellido: string,
        private _telefono: string,
    ) { }

    get id() { return this._id; }
    get nombreCompleto() { return `${this._nombre} ${this._apellido}`; }

    public toPrimitives() {
        return {
            id_de: this._id,
            nombre: this._nombre,
            apellido: this._apellido,
            telefono: this._telefono
        };
    }
}