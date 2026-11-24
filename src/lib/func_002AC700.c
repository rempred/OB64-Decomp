#include "game/actor_queries.h"

typedef struct StoryOverride {
    u8 profile;
    u8 artKey;
} StoryOverride;

extern u8 D_80193BD4[];
extern u8 D_80195574[];
extern StoryOverride table_002868F0[];

/* Combine the persistent gender with the actor's alignment band for the profile query. */
s32 func_002AC700(s32 slot)
{
    QueryActor *scene_body = D_8022A974->actors[slot];
    ActorInput *actor_record;
    s32 profile;
    s32 gender;
    s32 override_index;
    s32 primary_class_id;

    if (scene_body == 0) {
        return -1;
    }

    actor_record = &D_801CE8BC->roster[scene_body->battle_roster_index];
    if (actor_record->primary_class_id == 0) {
        return -1;
    }

    profile = actor_record->alignment;
    if (battle_actor_is_side_one(actor_record) == 0) {
        gender = D_80193BD4[actor_record->member_index * 56];
    } else {
        gender = D_80195574[actor_record->member_index * 52];
    }

    if (profile > 98) {
        profile = 98;
    }
    profile = gender * 3 + profile / 33;
    /* Keep the first key test separate so KMC reloads the loop base. */
    if (*(u8 *)0x8022A921 != 0xFF) {
        primary_class_id = actor_record->primary_class_id;
        override_index = 0;
        do {
            if (table_002868F0[override_index].artKey == primary_class_id) {
                profile = table_002868F0[override_index].profile;
            }
            override_index++;
        } while (table_002868F0[override_index].artKey != 0xFF);
    }

    return profile;
}
