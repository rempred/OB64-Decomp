typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_801CE8BC;
/* Return the scene roster index for the supplied actor, or -1. */
s32 battle_roster_find_actor_index(void *actor) {
    s32 actor_index;
    u8 *scene_bytes;
    if (actor == ((void *)0)) {
        return -1;
    }
    scene_bytes = D_801CE8BC;
    for (actor_index = 0; actor_index < 20; actor_index++) {
        if (scene_bytes + 0x1C4 + actor_index * 0xF8 == actor) {
            return actor_index;
        }
    }
    return -1;
}
