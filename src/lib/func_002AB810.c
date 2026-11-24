#include "game/battle_record_flag.h"

#include "game/battle_roster_record.h"

typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef float f32;

/* Bit-preserving compiler view, not a floating-point interpretation of a slot. */
typedef union SlotWord {
    s32 value;
    f32 floatView;
} SlotWord;

/* Local partial views agree with B02's source/unit layout and observed ABI.
 * Unknown scene fields retain offset names rather than stronger semantics. */
typedef struct BodySource {
    u8 pad_00[0x28];
    s16 x, y, z;
} BodySource;

typedef struct SceneBody {
    u8 pad_000[0xE0];
    void *descriptor;
    SlotWord slot;
    s32 source;
    s32 variant;
    s32 sequence;
    s32 sequenceTimer;
    s32 sequenceFlags;
    u8 pad_0FC[0x08];
    f32 scale[3];
    s32 rotate[3];
    f32 x, y, z;
    s32 field_128;
    s32 field_12C;
    f32 field_130;
    s16 state;
    u8 pad_136[0x02];
    s16 animation;
    s16 field_13A;
    u8 field_13C;
    u8 active;
    u8 pad_13E[0x03];
    u8 facing;
    u8 field_142[3];
    u8 field_145;
    u8 field_146;
    u8 field_147;
    u8 pad_148;
    u8 field_149;
    u8 pad_14A[0x06];
} SceneBody;

typedef struct SceneManager {
    u8 pad_00[0x18];
    SceneBody *records[0x1C];
} SceneManager;

extern SceneManager *D_8022A974;
extern s32 D_801CE8FC;
extern u8 D_8022F2CC;
extern s32 func_0020C120(void *actor);
extern void *resource_alloc(unsigned int size);
extern void func_00023780(void *destination, s32 size);
extern void *func_0002CD70(void *record, s32 arg1, unsigned int arg2);
extern f32 func_001FF7EC(s16 x, s16 z);

static __inline__ void initialize_fields(SceneBody *record, s32 state,
                                        s32 flip, void *descriptor,
                                        s32 fill_size, s32 *scene_word)
{
    s32 sceneValue;

    record->active = 1;
    sceneValue = *scene_word;
    record->state = state;
    record->sequence = -1;
    record->sequenceTimer = 0;
    record->sequenceFlags = 0;
    record->field_12C = 0;
    record->descriptor = descriptor;
    record->field_13A = flip;
    record->field_12C = 0;
    record->field_130 = 1.0f;
    record->field_128 = 0;
    record->field_145 = 1;
    record->field_13C = sceneValue;
    func_0002CD70(record, 0xFF, fill_size);
}

static __inline__ void initialize_body(SceneBody *record, s32 state,
                                      s32 primary_class_id, s32 secondary_class_id, s32 flip,
                                      void *descriptor, s32 fill_size, s32 *scene_word,
                                      s32 kind)
{
    /* Once-only scopes retain KMC flow notes used in register allocation.
     * Their nesting keeps the constants and output cursors in retail homes. */
    do { do { do {
        do {
            if (primary_class_id != -1) record->source = primary_class_id;
        } while (0);
    } while (0); } while (0); } while (0);
    record->animation = state;
    do {
        do {
            if (secondary_class_id != -1) record->variant = secondary_class_id;
        } while (0);
        /* Keep both inline expansions for pre-reload argument scheduling.
         * KMC's late jump pass merges their identical emitted bodies. */
        if (kind) {
            initialize_fields(record, state, flip, descriptor, fill_size, scene_word);
        } else {
            initialize_fields(record, state, flip, descriptor, fill_size, scene_word);
        }
        func_00023780((u8 *)record + 0x10, 0x10);
    } while (0);
}

s32 func_002AB810(s32 *slots, BattleRosterRecord *actor, s32 actor_index, s32 flip,
                  s32 primary_class_id, s32 secondary_class_id, u8 seen_leader)
{
    SceneBody *record;
    s32 first_body_slot;
    s32 kind;
    s32 i;
    s32 slot;
    s32 state;
    void *descriptor = &D_8022F2CC;
    u8 stored_actor_index;
    s32 special_body_kind;
    s32 fill_size;
    SlotWord slotBits;
    s32 *scene_word;

    first_body_slot = 0;
    kind = 0;
    if (battle_actor_secondary_class_is_one(actor) == 1) {
        kind = 1;
    } else if (func_0020C120(actor) == 1) {
        kind = 2;
    } else if (primary_class_id == 0x87) {
        if (seen_leader == 1) kind = 4;
    } else if (primary_class_id == 0xA1) {
        kind = 2;
    } else if (primary_class_id == 0x88) {
        kind = 2;
    }

    scene_word = &D_801CE8FC;
    fill_size = 0x10;
    i = 0;
    do {
        if (actor->primary_children[i] != 0) {
            for (slot = 0; slot < 0x1C; slot++) {
                if (D_8022A974->records[slot] == 0) {
                    break;
                }
            }
            slots[i] = slot;
            if (i == 0) {
                first_body_slot = slot;
            }
            record = D_8022A974->records[slot] = resource_alloc(0x150);
            func_00023780(record, 0x150);
            if (i == 1 && kind == 2) {
                record->slot.value = slot & 0xFF;
                state = 0x3C;
            } else {
                do { special_body_kind = 4; } while (0);
                if (kind == special_body_kind) {
                    /* Preserve the word bits through the alternate union view.
                     * KMC otherwise merges this arm with the earlier state-60 arm.
                     * This is a compiler-shape workaround, not a floating slot. */
                    slotBits.value = slot & 0xFF;
                    record->slot.floatView = slotBits.floatView;
                    state = 0x3C;
                } else {
                    record->slot.value = slot & 0xFF;
                    state = 0xA;
                }
            }
            initialize_body(record, state, primary_class_id, secondary_class_id, flip, descriptor,
                            fill_size, scene_word, kind);
            record->field_146 = flip;
            record->facing = 0;
            record->x = ((BodySource *)actor->primary_children[i])->x;
            record->z = ((BodySource *)actor->primary_children[i])->z;
            do { special_body_kind = 4; } while (0);
            if (kind != special_body_kind) {
                record->y = (s16)func_001FF7EC(record->x, record->z);
            } else {
                record->y = ((BodySource *)actor->primary_children[i])->y;
            }
            for (slot = 0; slot < 3; slot++) {
                record->scale[slot] = 1.0f;
                record->rotate[slot] = 0;
                record->field_142[slot] = 0xFF;
            }
            stored_actor_index = actor_index;
            record->field_147 = stored_actor_index;
            record->field_149 = i;
        }
    } while (++i < 3);
    return first_body_slot;
}
