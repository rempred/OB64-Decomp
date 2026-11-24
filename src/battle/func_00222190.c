#include "game/battle_roster_record.h"

float vec3_distance(const float origin[3], const float destination[3]);
float func_00201670(int sourceArt, int ownerContext);

int func_00222190(BattleRosterRecord *actor, int x0, int z0, int x1, int z1)
{
    float origin[3];
    float destination[3];
    float distance;
    int allocation_value;

    /* Pinned GCC needs this equivalent word identity to retain the incoming
     * integer in a general register. The plain form uses a direct COP1 load
     * and is eight bytes shorter than retail. */
    allocation_value = z1 | x1;
    z1 = allocation_value & z1;

    origin[0] = (float)x0;
    origin[1] = 0.0f;
    origin[2] = (float)z0;
    destination[0] = (float)x1;
    destination[1] = 0.0f;
    destination[2] = (float)z1;
    distance = vec3_distance(origin, destination);
    distance /= func_00201670(actor->primary_class_id.word, actor->secondary_class_id.word);
    return (int)distance;
}
