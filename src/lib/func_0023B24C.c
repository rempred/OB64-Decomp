typedef unsigned char u8;
typedef signed short s16;
typedef struct {
    u8 unk00[0xD0];
    u8 bD0;
} Ent23B;
void *battle_roster_lookup_actor(unsigned int index);
void func_0023B24C(s16 a) {
    Ent23B *record = battle_roster_lookup_actor(a);

    record->bD0 = 1;
}
