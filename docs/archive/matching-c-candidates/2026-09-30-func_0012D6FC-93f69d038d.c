typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;
typedef struct RuntimeUnit RuntimeUnit;

/* A numeric view of the complete 64-byte allocation. No field meaning or
 * grid/index capacity is inferred beyond the observed offsets and strides. */
typedef struct MovementAux {
    s32 field_00, field_04, field_08, field_0C;
    s32 field_10, field_14;
    void *field_18;
    void *field_1C, *field_20, *field_24;
    s32 field_28, field_2C;
    void *field_30;
    u8 gap_34[8];
    s32 field_3C;
} MovementAux;

#define FIELD(object, type, offset) (*(type *)((u8 *)(object) + (offset)))
extern u8 D_800E7AB9, D_800E7AC3;
extern u8 D_801F0D98[];
extern s32 D_801F0DA8, D_801F0DAC;
extern u8 *D_801F0DB0;
extern u16 *D_801F0DB4;
extern u16 D_801F36D8[];
extern void *resource_alloc(u32 bytes);
extern void resource_free(void *object);
extern s32 *func_00107D60(s32 first, s32 second, void *third);
extern void func_00107E38(MovementAux *object);
extern void func_0011AECC(RuntimeUnit *unit);
extern void func_0012C788(u8 first, RuntimeUnit *unit, s32 third, s32 fourth);

void func_0012D6FC(RuntimeUnit *unit, s32 selector, s32 *state)
{
    MovementAux *aux = FIELD(unit, MovementAux *, 0xA0);

    if (aux == 0) {
        if (*state == 0) {
            aux = resource_alloc(0x40);
            FIELD(unit, MovementAux *, 0xA0) = aux;
            if (aux != 0) {
                s32 value = *(s32 *)((u8 *)unit + 0x54 +
                                   (FIELD(unit, s32, 0x24) << 2));
                aux->field_00 = FIELD(unit, s32, 0x14);
                aux->field_10 = 0x3F;
                aux->field_14 = 0x3F;
                aux->field_08 = 0;
                aux->field_0C = 0;
                aux->field_18 = D_801F0D98;
                aux->field_04 = value;
                aux->field_1C = resource_alloc(D_801F0DA8 * D_801F0DAC);
                aux->field_20 = resource_alloc(D_801F0DA8 * (D_801F0DAC << 2));
                aux->field_24 = resource_alloc(D_801F0DA8 * (D_801F0DAC << 2));
                aux->field_30 = resource_alloc(D_801F0DA8 * (D_801F0DAC * 12));
                aux->field_3C = 0;
                aux->field_28 = 0;
                aux->field_2C = 0;
            }
            D_801F0DB4 = D_801F36D8 + ((selector & 0xFF) << 5);
            D_801F0DB0 = *(u8 **)((u32)&D_800E7AC3 +
                                 ((u32)D_800E7AC3 << 2) - 0x33);

            if (aux != 0) {
                if (aux->field_1C != 0 && aux->field_20 != 0 &&
                    aux->field_24 != 0 && aux->field_30 != 0)
                    goto dispatch;
                if (aux->field_1C != 0) {
                    resource_free(aux->field_1C);
                    aux->field_1C = 0;
                }
                if (aux->field_20 != 0) {
                    resource_free(aux->field_20);
                    aux->field_20 = 0;
                }
                if (aux->field_24 != 0) {
                    resource_free(aux->field_24);
                    aux->field_24 = 0;
                }
                if (aux->field_30 != 0) {
                    resource_free(aux->field_30);
                    aux->field_30 = 0;
                }
            }
            if (FIELD(unit, MovementAux *, 0xA0) != 0) {
                resource_free(FIELD(unit, MovementAux *, 0xA0));
                FIELD(unit, MovementAux *, 0xA0) = 0;
            }
        }
    } else if (aux->field_28 != 0) {
        if (*state == 0) {
dispatch:
            func_00107E38(FIELD(unit, MovementAux *, 0xA0));
            *state = 1;
        }
    } else if (FIELD(unit, void *, 0x68) != 0) {
        func_0012C788(D_800E7AB9, unit, 5, 1);
    } else {
        s32 *result = func_00107D60(FIELD(unit, s32, 0x14),
                                  *(s32 *)((u8 *)unit + 0x54 +
                                    (FIELD(unit, s32, 0x24) << 2)),
                                  aux->field_24);
        if (result != 0) {
            FIELD(unit, s32 *, 0x68) = result;
            resource_free(aux->field_1C);
            aux->field_1C = 0;
            resource_free(aux->field_20);
            aux->field_20 = 0;
            resource_free(aux->field_24);
            aux->field_24 = 0;
            resource_free(aux->field_30);
            aux->field_30 = 0;
            func_0011AECC(unit);
            FIELD(unit, s32, 0x6C) = 1;
        }
    }
}
