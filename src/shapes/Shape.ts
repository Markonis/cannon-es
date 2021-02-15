import type { Vec3 } from '../math/Vec3'
import type { Quaternion } from '../math/Quaternion'
import type { Body } from '../objects/Body'
import type { Material } from '../material/Material'

/**
 * The available shape types.
 */
export const SHAPE_TYPES = {
  SPHERE: 1,
  PLANE: 2,
  BOX: 4,
  COMPOUND: 8,
  CONVEXPOLYHEDRON: 16,
  HEIGHTFIELD: 32,
  PARTICLE: 64,
  CYLINDER: 128,
  TRIMESH: 256,
} as const

export type ShapeType = typeof SHAPE_TYPES[keyof typeof SHAPE_TYPES]

export type ShapeOptions = ConstructorParameters<typeof Shape>[0]

/**
 * Base class for shapes
 */
export class Shape {
  /**
   * Identifier of the Shape.
   */
  id: number

  /**
   * The type of this shape. Must be set to an int > 0 by subclasses.
   */
  type: ShapeType | 0

  /**
   * The local bounding sphere radius of this shape.
   */
  boundingSphereRadius: number

  /**
   * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled.
   * @default true
   */
  collisionResponse: boolean

  /**
   * @default 1
   */
  collisionFilterGroup: number

  /**
   * @default -1
   */
  collisionFilterMask: number

  /**
   * @default null
   */
  material: Material | null
  body: Body | null

  static idCounter: number
  static types: typeof SHAPE_TYPES

  constructor(
    options: {
      type?: ShapeType
      /**
       * Whether to produce contact forces when in contact with other bodies.
       * @default true
       */
      collisionResponse?: boolean
      collisionFilterGroup?: number
      collisionFilterMask?: number
      material?: Material
    } = {}
  ) {
    this.id = Shape.idCounter++
    this.type = options.type || 0
    this.boundingSphereRadius = 0
    this.collisionResponse = options.collisionResponse ? options.collisionResponse : true
    this.collisionFilterGroup = options.collisionFilterGroup !== undefined ? options.collisionFilterGroup : 1
    this.collisionFilterMask = options.collisionFilterMask !== undefined ? options.collisionFilterMask : -1
    this.material = options.material ? options.material : null
    this.body = null
  }

  /**
   * Computes the bounding sphere radius.
   * The result is stored in the property `boundingSphereRadius`
   */
  updateBoundingSphereRadius(): void {
    throw `computeBoundingSphereRadius() not implemented for shape type ${this.type}`
  }

  /**
   * Get the volume of this shape
   */
  volume(): number {
    throw `volume() not implemented for shape type ${this.type}`
  }

  /**
   * Calculates the inertia in the local frame for this shape.
   * @see http://en.wikipedia.org/wiki/List_of_moments_of_inertia
   */
  calculateLocalInertia(mass: number, target: Vec3): void {
    throw `calculateLocalInertia() not implemented for shape type ${this.type}`
  }

  calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void {
    throw `calculateWorldAABB() not implemented for shape type ${this.type}`
  }
}

Shape.idCounter = 0

Shape.types = SHAPE_TYPES
