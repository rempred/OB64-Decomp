#include "game/battle_record_flag.h"

#include "game/class_field_lookups.h"
extern u8 D_801976DC;
typedef struct {
    u8 b[0x38];
} PChar1F;
typedef struct {
    u8 b[0x34];
} EChar1F;
extern PChar1F D_80193BC0_copy[];
extern EChar1F D_80195560_copy[];
extern u8 D_801976E8;
extern const char D_801CE890[];
int func_000238B0(char *buf, const char *fmt, ...);
void func_001F2E48(signed char *s, s32 side);
/* Format the persistent character's name for the side selected by the battle actor. */
void func_001F2F9C(u8 *actor, u8 *other_actor) {
    signed char message[64];
    u8 *character_bytes;
    s32 uses_56_byte_table;
    if (func_0020C014(actor)) {
        s32 source_index = D_801976DC;
        uses_56_byte_table = source_index < 30;
    } else {
        s32 source_index = D_801976E8;
        uses_56_byte_table = source_index < 30;
    }
    if (uses_56_byte_table) {
        character_bytes = D_80193BC0_copy[actor[0xF6]].b;
    } else {
        character_bytes = D_80195560_copy[actor[0xF6]].b;
    }
    func_000238B0((char *)message, D_801CE890, character_bytes, D_8016E1DC(other_actor[0x4B], other_actor[0x4F]));
    func_001F2E48(message, func_0020C014(actor));
}
