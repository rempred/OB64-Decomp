#include "game/combat_types.h"

typedef struct SupplementActor SupplementActor;
typedef struct SupplementChild SupplementChild;
struct SupplementChild {
    void (*callback)(void);
    unsigned char field_04[0x10];
    unsigned char field_14, field_15[0x1F];
    short field_34;
    unsigned char field_36[10];
    SupplementActor *actor;
    int resource;
    unsigned char field_48[0x44];
    unsigned char field_8C, field_8D[3];
    SupplementChild *primary;
};
struct SupplementActor {
    SupplementChild *children[6];
    unsigned char field_18[8];
    u16 field_20, field_22, field_24[9];
    u16 field_36, field_38, field_3A, field_3C;
    unsigned char field_3E[2];
    u32 flags, field_44;
    int field_48, field_4C, resource, field_54, field_58;
    int x, y, z, field_68, field_6C, field_70;
    unsigned char field_74[0x24];
    int field_98, field_9C;
    unsigned char field_A0[11], field_AB, field_AC;
};
struct Func001F0E64Record;
extern void func_001F0E64(struct Func001F0E64Record *, u32);
extern unsigned char func_0020D434(int);
extern int func_00044238(int, int, int);
extern float func_001BC35C(short, short);
extern int func_002015C8(int, int, int, int);
extern u16 func_00043e88(int, int);
extern u16 func_00043edc(int, int);
extern u16 func_00043f30(int, int);
extern u16 func_00043f84(int, int);
extern void func_0020C4B8(int, int, int, int *, int *);
extern int func_0020D444(u16, u16);
extern SupplementChild *func_0020F2A8(int, int, int, int);
extern void func_001F7148(void);
extern void func_001F89B4(void);
extern int D_801CE8FC;

static __inline__ int flag8(SupplementActor *actor)
{
    return actor ? (actor->flags >> 8) & 1 : 0;
}
static __inline__ int kind1(SupplementActor *actor)
{
    return actor ? actor->field_4C == 1 : 0;
}
static __inline__ int offset_kind(SupplementActor *actor)
{
    if (!actor) return 0;
    return (actor->field_4C == 0xA) | (actor->field_4C == 0x19) |
           (actor->field_4C == 0x7B);
}

/* Coordinate additions retain the low 32 bits before the signed call ABI. */
#define COORD(field, delta) ((int)((u32)actor->field + (u32)(delta)))
#define FINISH_PAIR() do { \
    secondary->actor = actor; \
    primary->actor = actor; \
    primary->callback = func_001F7148; \
    secondary->callback = func_001F89B4; \
    primary->field_34 = 255; \
    secondary->field_34 = D_801CE8FC; \
    secondary->resource = actor->resource; \
    primary->resource = secondary->resource; \
    secondary->primary = primary; \
    primary->primary = primary; \
} while (0)
/* Both calls reload actor coordinates; a shared captured position would hide
 * the allocator's opportunity to change them between calls. */
#define ALLOC_PAIR(slot, dx, dy, dz) do { \
    primary = func_0020F2A8(actor->resource, COORD(x, dx), COORD(y, dy), COORD(z, dz)); \
    primary->field_14 = 0; \
    actor->children[(slot)] = primary; \
    secondary = func_0020F2A8(actor->resource, COORD(x, dx), COORD(y, dy), COORD(z, dz)); \
    secondary->field_14 = 0; \
    actor->children[(slot) + 3] = secondary; \
    FINISH_PAIR(); \
} while (0)

void func_0020CBDC(SupplementActor *actor, int mode)
{
    int screenX, screenY;
    int position = actor->field_58;
    int source = actor->field_48;
    int context = actor->field_4C;
    int column = actor->field_54;
    int response;
    SupplementChild *primary, *secondary;
    SupplementChild **cursor, **end;

    response = func_00044238((unsigned char)source, (unsigned char)context,
                            (unsigned char)func_0020D434(position));
    actor->x = (int)(((u32)position - 4u) * 38u);
    actor->field_70 = (unsigned char)response;
    actor->field_AC = 255;
    actor->field_AB = 255;
    actor->z = (int)(((u32)column - 1u) * 38u);
    actor->y = (int)func_001BC35C(*(short *)((unsigned char *)actor + 0x5E),
                                 (short)actor->z);
    actor->resource = func_002015C8(source, context, flag8(actor), flag8(actor));
    if (!actor->field_36) actor->field_36 = func_00043e88((unsigned char)source, (unsigned char)context);
    if (!actor->field_38) actor->field_38 = func_00043edc((unsigned char)source, (unsigned char)context);
    if (!actor->field_3A) actor->field_3A = func_00043f30((unsigned char)source, (unsigned char)context);
    if (!actor->field_3C) actor->field_3C = func_00043f84((unsigned char)source, (unsigned char)context);
    func_0020C4B8(actor->x, actor->y, actor->z, &screenX, &screenY);
    actor->field_98 = screenX;
    actor->field_9C = screenY;

    if (kind1(actor)) {
        int pairIndex = 0;
        int count = func_0020D444(actor->field_20, actor->field_22);
        const int *offsets = (const int *)0x801CEDFC;
        while (pairIndex < count) {
            int dx = offsets[0], dz = offsets[1];
            ALLOC_PAIR(pairIndex, dx, 0, dz);
            if (!mode) {
                actor->children[pairIndex + 3]->field_8C = 2;
                actor->children[pairIndex]->field_8C = 2;
            }
            pairIndex++;
            offsets += 2;
        }
    } else if (offset_kind(actor)) {
        int dx = -8, dz = 8;
        if (!actor || flag8(actor)) { dx = 8; dz = -8; }
        ALLOC_PAIR(0, 0, 0, 0);
        ALLOC_PAIR(1, dx, 0, dz);
        actor->children[4]->field_8C = 3;
        actor->children[1]->field_8C = 3;
    } else if (actor->field_48 == 0x87) {
        if (!mode) {
            ALLOC_PAIR(0, 0, 0, 0);
        } else {
            int oldZ = actor->z;
            actor->z = (int)((u32)oldZ + 10u);
            primary = func_0020F2A8(actor->resource, COORD(x, 1), COORD(y, 57),
                                    (int)((u32)oldZ + 48u));
            primary->field_14 = 0;
            actor->children[0] = primary;
            secondary = func_0020F2A8(actor->resource, COORD(x, 1), COORD(y, 57), COORD(z, 38));
            secondary->field_14 = 0;
            actor->children[3] = secondary;
            FINISH_PAIR();
            actor->children[0]->field_8C = 1;
            ALLOC_PAIR(1, 1, 57, -38);
            actor->children[1]->field_8C = 1;
            actor->flags |= 0x1000;
        }
        actor->flags |= 0x800;
    } else if (actor->field_48 == 0x88 || actor->field_48 == 0xA1) {
        ALLOC_PAIR(0, 0, 0, 0);
        ALLOC_PAIR(1, -38, 0, 0);
        actor->children[1]->field_8C = 1;
        actor->flags |= 0x800;
    } else {
        ALLOC_PAIR(0, 0, 0, 0);
        actor->children[3]->field_8C = 2;
        actor->children[0]->field_8C = 2;
    }
    /* Retained slots participate even when this branch created fewer pairs. */
    cursor = actor->children;
    end = cursor + 3;
    do {
        if (*cursor) {
            int selected = actor ? (actor->flags >> 1) & 1 : 0;
            func_001F0E64((struct Func001F0E64Record *)((unsigned char *)*cursor + 0x44),
                           selected ? 38u : 0u);
        }
        cursor++;
    } while (cursor < end);
}
