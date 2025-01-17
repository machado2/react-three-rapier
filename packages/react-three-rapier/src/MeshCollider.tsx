import { Collider } from "@dimforge/rapier3d-compat";
import React, { ReactNode, useRef, useEffect } from "react";
import { Object3D } from "three";
import { useRapier } from "./hooks";
import { useRigidBodyContext } from "./RigidBody";
import { RigidBodyAutoCollider } from "./types";
import { createCollidersFromChildren } from "./utils";

interface MeshColliderProps {
  children: ReactNode;
  type: RigidBodyAutoCollider;
}

export const MeshCollider = ({ children, type }: MeshColliderProps) => {
  const { physicsOptions, world } = useRapier();
  const object = useRef<Object3D>(null);
  const { api, options } = useRigidBodyContext();

  useEffect(() => {
    let autoColliders: Collider[] = [];

    if (object.current) {
      const colliderSetting = type ?? physicsOptions.colliders ?? false;

      if ("raw" in api) {
        autoColliders = createCollidersFromChildren({
          object: object.current,
          rigidBody: api,
          options: {
            ...options,
            colliders: colliderSetting,
          },
          world,
          ignoreMeshColliders: false,
        });
      }
    }

    return () => {
      autoColliders.forEach((collider) => {
        world.removeCollider(collider);
      });
    };
  }, []);

  return (
    <object3D
      ref={object}
      userData={{
        r3RapierType: "MeshCollider",
      }}
    >
      {children}
    </object3D>
  );
};
