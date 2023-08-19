/**
 * Clase Area
 */
export class Area {
  _id;
  _areaName;
  _areaPopulation;
  _areaSaturation;
  _areaIsEmpty;
  _tareas;

  /**
   * Constructor de la clase Area
   * @param {*} id 
   * @param {*} areaName 
   * @param {*} areaPopulation 
   * @param {*} areaSaturation 
   * @param {*} areaIsEmpty 
   * @param {*} tareas 
   */
  constructor(id, areaName, areaPopulation, areaSaturation, areaIsEmpty, tareas) {
    this._id = id;
    this._areaName = areaName;
    this._areaPopulation = areaPopulation;
    this._areaSaturation = areaSaturation;
    this._areaIsEmpty = areaIsEmpty;
    this._tareas = tareas;
  }

  // Getters y Setters

  get id() {
    return this._id;
  }

  get areaName() {
    return this._areaName;
  }

  get areaPopulation() {
    return this._areaPopulation;
  }

  get areaSaturation() {
    return this._areaSaturation;
  }

  get areaIsEmpty() {
    return this._areaIsEmpty;
  }

  set id(id) {
    this._id = id;
  }

  set areaName(areaName) {
    this._areaName = areaName;
  }

  set areaPopulation(areaPopulation) {
    this._areaPopulation = areaPopulation;
  }

  set areaSaturation(areaSaturation) {
    this._areaSaturation = areaSaturation;
  }

  set areaIsEmpty(areaIsEmpty) {
    this._areaIsEmpty = areaIsEmpty;
  }

  get tareas() {
    return this._tareas;
  }

  set tareas(tareas) {
    this._tareas = tareas;
  }

  //To String

  toString() {
    return (
      "Area: " +
      this._areaName +
      "\n" +
      "Población: " +
      this._areaPopulation +
      "\n" +
      "Saturación: " +
      this._areaSaturation +
      "\n" +
      "Vacío: " +
      this._areaIsEmpty +
      "\n" +
      "Tareas: " +
      this._tareas
    );
  }
}
