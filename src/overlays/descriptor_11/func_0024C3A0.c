typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
s32 battle_roster_find_actor_index_at_position(unsigned int lane, s32 row);
s16 func_0024C3A0(u8 c) {
    s32 v = c - 20;
    return battle_roster_find_actor_index_at_position(v % 3, v / 3);
}
