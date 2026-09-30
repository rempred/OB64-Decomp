typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;
typedef float f32;
typedef struct RuntimeUnit RuntimeUnit;
typedef struct MovementAux MovementAux;
#define FIELD(object, type, offset) (*(type *)((u8 *)(object) + (offset)))
extern RuntimeUnit *D_801F0CB0[];
extern u8 D_800E7A90[];
extern u8 D_801F0D98[];
extern f32 D_801F0D9C, D_801F0DA0, D_801F0DA4;
extern s32 D_801F0DA8, D_801F0DAC;
extern u8 *D_801F0DB0;
extern u16 *D_801F0DB4;
extern u16 D_801F36D8[];
extern u8 D_801EE740[];
extern void *resource_alloc(u32 bytes);
extern void resource_free(void *object);
extern void func_80093380(void *destination, s32 bytes);
extern void func_80093540(const void *message);
extern void func_00106CE0(f32 *first, f32 *second, f32 step);
extern s32 func_00125298(RuntimeUnit *unit);
extern s32 func_00107E38(MovementAux *aux);
extern void func_00125460(s32 selector, RuntimeUnit *unit);
extern void func_801B2B78(RuntimeUnit *unit);
extern void func_801D427C(RuntimeUnit *unit);
extern s32 func_801CFF5C(RuntimeUnit *unit, f32 *point);
extern s32 *func_00107D60(s32 first, s32 second, void *predecessors);
extern void func_0011AECC(RuntimeUnit *unit);

/* The complete owner contains the return delay and a four-byte original
 * alignment tail. This independent research does not supply that tail or
 * change the accepted owner/producer contract. */
void func_00125F84(RuntimeUnit *unit, s32 selector, s32 *state)
{
    MovementAux *aux;
    MovementAux *current;
    s32 *path = 0;
    s32 target;
    f32 point[3];

    if (FIELD(unit, u8, 0x20) == 0) {
        func_00106CE0(&FIELD(unit, f32, 0x18), &FIELD(unit, f32, 0x1C), 1.0f);
        if (FIELD(unit, f32, 0x18) == FIELD(unit, f32, 0x1C)) {
            u32 flags = FIELD(unit, u32, 0x00) & ~2U;
            FIELD(unit, u32, 0x00) = flags;
            if (FIELD(unit, u8, 0x04) < 30) {
                u8 mode = FIELD(unit, u8, 0x92);
                if ((u32)(mode - 1) >= 2 && FIELD(unit, s32, 0x74) != -1 && mode == 0) {
                    f32 x = FIELD(unit, f32, 0x08);
                    f32 y = FIELD(unit, f32, 0x0C);
                    f32 z = FIELD(unit, f32, 0x10);
                    s32 index = FIELD(unit, s32, 0x14);
                    FIELD(unit, u32, 0x00) = flags | 0x800000;
                    FIELD(unit, f32, 0x4C) = x;
                    FIELD(unit, f32, 0x50) = y;
                    FIELD(unit, f32, 0x54) = z;
                    FIELD(unit, s32, 0x64) = index;
                }
            }
        }
        return;
    }

    current = FIELD(unit, MovementAux *, 0xA0);
    if (current == 0) {
        s32 ready;
        if (*state != 0)
            return;
        aux = FIELD(unit, MovementAux *, 0xA0) = resource_alloc(0x40);
        if (aux != 0) {
            s32 position, value;
            func_80093380(aux, 0x40);
            FIELD(aux, s32, 0x00) = FIELD(unit, s32, 0x14);
            if (!(((FIELD(unit, u32, 0x00) & 0x2000) == 0 && FIELD(unit, u8, 0x91) == 1) ||
                  ((FIELD(unit, u32, 0x00) & 0x2000) != 0 && FIELD(unit, u8, 0x92) == 1)))
                goto indexed_target;
            if (FIELD(unit, s32, 0x84) == -1)
                goto indexed_target;
            position = 3;
            goto target_ready;
indexed_target:
            position = FIELD(unit, s32, 0x24) - 1;
target_ready:
            value = FIELD(unit, s32, 0x58 + position * 4);
            FIELD(aux, s32, 0x10) = 0x3F;
            FIELD(aux, s32, 0x14) = 0x3F;
            FIELD(aux, s32, 0x08) = 0;
            FIELD(aux, s32, 0x0C) = 0;
            FIELD(aux, void *, 0x18) = D_801F0D98;
            FIELD(aux, s32, 0x04) = value;
            FIELD(aux, void *, 0x1C) = resource_alloc(D_801F0DA8 * D_801F0DAC);
            FIELD(aux, void *, 0x20) = resource_alloc(D_801F0DA8 * (D_801F0DAC << 2));
            FIELD(aux, void *, 0x24) = resource_alloc(D_801F0DA8 * (D_801F0DAC << 2));
            {
                s32 height = D_801F0DAC;
                s32 width = D_801F0DA8;
                FIELD(aux, void *, 0x30) = resource_alloc(width * (height * 12));
            }
            FIELD(aux, void *, 0x3C) = 0;
            ready = 1;
            if (!(FIELD(unit, u32, 0x00) & 0x2000) && FIELD(unit, u8, 0x91) == 2)
                ready = func_00125298(unit);
            FIELD(aux, s32, 0x28) = 0;
            FIELD(aux, s32, 0x2C) = 0;
        } else {
            ready = 0;
        }
        {
            u32 row = FIELD(unit, u32, 0x70) << 6;
            u32 bank = D_800E7A90[0x33];
            D_801F0DB4 = (u16 *)((u32)D_801F36D8 + row);
            D_801F0DB0 = *(u8 **)(D_800E7A90 + bank * 4);
        }
        if (aux == 0 || FIELD(aux, void *, 0x1C) == 0 || FIELD(aux, void *, 0x20) == 0 ||
            FIELD(aux, void *, 0x24) == 0 || ((FIELD(aux, void *, 0x30) == 0) | (ready == 0))) {
            func_80093540(D_801EE740);
            if (aux != 0) {
                if (FIELD(aux, void *, 0x1C) != 0) {
                    resource_free(FIELD(aux, void *, 0x1C));
                    FIELD(aux, void *, 0x1C) = 0;
                }
                if (FIELD(aux, void *, 0x20) != 0) {
                    resource_free(FIELD(aux, void *, 0x20));
                    FIELD(aux, void *, 0x20) = 0;
                }
                if (FIELD(aux, void *, 0x24) != 0) {
                    resource_free(FIELD(aux, void *, 0x24));
                    FIELD(aux, void *, 0x24) = 0;
                }
                if (FIELD(aux, void *, 0x30) != 0) {
                    resource_free(FIELD(aux, void *, 0x30));
                    FIELD(aux, void *, 0x30) = 0;
                }
                if (FIELD(aux, void *, 0x3C) != 0) {
                    resource_free(FIELD(aux, void *, 0x3C));
                    FIELD(aux, void *, 0x3C) = 0;
                }
            }
            if (FIELD(unit, MovementAux *, 0xA0) != 0) {
                resource_free(FIELD(unit, MovementAux *, 0xA0));
                FIELD(unit, MovementAux *, 0xA0) = 0;
            }
            return;
        }
        if (!(FIELD(unit, u32, 0x00) & 0x2000) && FIELD(unit, u8, 0x91) == 2) {
            MovementAux *latest = FIELD(unit, MovementAux *, 0xA0);
            u8 *buffer = FIELD(latest, u8 *, 0x3C);
            if (buffer != 0 && (buffer[FIELD(latest, s32, 0x04)] != 0 || buffer[FIELD(latest, s32, 0x00)] != 0))
                return;
        }
        current = FIELD(unit, MovementAux *, 0xA0);
        goto dispatch;
    }
    if (FIELD(current, s32, 0x28) != 0) {
        if (*state != 0)
            return;
dispatch:
        func_00107E38(current);
        *state = 1;
        return;
    }
    if (!(FIELD(unit, u32, 0x00) & 0x2000) && FIELD(unit, u8, 0x91) == 2)
        FIELD(unit, s32, 0x88) -= 1;
    if (FIELD(unit, s32 *, 0x68) != 0) {
        func_00125460(selector, unit);
        return;
    }
    aux = FIELD(unit, MovementAux *, 0xA0);
    if (((FIELD(unit, u32, 0x00) & 0x2000) == 0 && FIELD(unit, u8, 0x91) == 1) ||
        ((FIELD(unit, u32, 0x00) & 0x2000) != 0 && FIELD(unit, u8, 0x92) == 1)) {
        if (FIELD(unit, s32, 0x84) != -1) {
            target = FIELD(unit, s32, 0x64);
            if (FIELD(aux, u8 *, 0x1C)[target] != 0)
                goto construct_path;
            if ((FIELD(unit, u8, 0xB8) & 0xF0) != 0x10) {
                FIELD(unit, u8, 0xB8) = 0x10;
                FIELD(unit, u8, 0xB9) = 2;
                func_801B2B78(unit);
                FIELD(unit, s32, 0x84) = -1;
            }
            goto path_ready;
        }
    }
    if (!(FIELD(unit, u32, 0x00) & 0x2000) && FIELD(unit, u8, 0x91) == 2) {
        u8 *buffer = FIELD(aux, u8 *, 0x3C);
        if (buffer != 0) {
            if (buffer[FIELD(aux, s32, 0x00)] != 0) {
                func_801D427C(unit);
                goto path_ready;
            }
            if (buffer[FIELD(aux, s32, 0x04)] != 0)
                goto unavailable_target;
        }
        target = FIELD(unit, s32, 0x54 + FIELD(unit, s32, 0x24) * 4);
        if (FIELD(aux, u8 *, 0x1C)[target] != 0)
            goto construct_path;
unavailable_target:
        if ((FIELD(unit, u8, 0xB8) & 0xF0) != 0x10) {
            func_801B2B78(unit);
            if ((FIELD(unit, u32, 0x00) & 0x08000000) && func_801CFF5C(unit, point) != -1) {
                f32 lowZ, z, lowX, x;
                if (FIELD(unit, f32, 0x08) == point[0] && FIELD(unit, f32, 0x10) == point[2])
                    point[2] += 0.0001f;
                FIELD(unit, f32, 0x28) = point[0];
                FIELD(unit, f32, 0x2C) = point[1];
                FIELD(unit, f32, 0x30) = point[2];
                lowZ = D_801F0D9C;
                z = (point[2] - lowZ) * 64.0f / (D_801F0DA4 - lowZ);
                lowX = FIELD(D_801F0D98, f32, 0);
                x = (point[0] - lowX) * 64.0f / (D_801F0DA0 - lowX);
                FIELD(unit, s32, 0x58) = ((s32)z << 6) + (s32)x;
            } else {
                FIELD(unit, u8, 0xB8) = 0x10;
                FIELD(unit, u8, 0xB9) = 2;
            }
        }
        goto path_ready;
    }
    target = FIELD(unit, s32, 0x54 + FIELD(unit, s32, 0x24) * 4);
    if (FIELD(aux, u8 *, 0x1C)[target] != 0)
        goto construct_path;
    if ((FIELD(unit, u8, 0xB8) & 0xF0) != 0x10) {
        FIELD(unit, u8, 0xB8) = 0x10;
        FIELD(unit, u8, 0xB9) = 2;
        func_801B2B78(unit);
        if ((FIELD(unit, u32, 0x00) & 0x204) == 4 && FIELD(unit, s32, 0x24) == FIELD(unit, u8, 0x20)) {
            s32 position = FIELD(unit, s32, 0x24) - 1;
            s32 index = FIELD(unit, s32, 0x80);
            RuntimeUnit *view = (RuntimeUnit *)((u8 *)unit + position * 12);
            FIELD(view, f32, 0x28) = FIELD(D_801F0CB0[index], f32, 0x08);
            FIELD(view, f32, 0x2C) = FIELD(D_801F0CB0[index], f32, 0x0C);
            FIELD(view, f32, 0x30) = FIELD(D_801F0CB0[index], f32, 0x10);
            FIELD(unit, s32, 0x58 + position * 4) = FIELD(D_801F0CB0[index], s32, 0x14);
        }
    }
    goto path_ready;
construct_path:
    path = func_00107D60(FIELD(unit, s32, 0x14), target, FIELD(aux, void *, 0x24));
path_ready:
    if (path != 0) {
        FIELD(unit, s32 *, 0x68) = path;
        resource_free(FIELD(aux, void *, 0x1C));
        FIELD(aux, void *, 0x1C) = 0;
        resource_free(FIELD(aux, void *, 0x20));
        FIELD(aux, void *, 0x20) = 0;
        resource_free(FIELD(aux, void *, 0x24));
        FIELD(aux, void *, 0x24) = 0;
        resource_free(FIELD(aux, void *, 0x30));
        FIELD(aux, void *, 0x30) = 0;
        if (FIELD(aux, void *, 0x3C) != 0) {
            resource_free(FIELD(aux, void *, 0x3C));
            FIELD(aux, void *, 0x3C) = 0;
        }
        func_0011AECC(unit);
        FIELD(unit, s32, 0x6C) = 1;
    }
}
