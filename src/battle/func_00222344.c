#include "game/battle_roster_record.h"

float vec3_distance(const float destination[3], const float origin[3]);
float func_002016F4(int sourceArt, int ownerContext);

int func_00222344(BattleRosterRecord *actor, int x0, int z0, int x1, int z1)
{
    float destination[3];
    float origin[3];
    float distance;
    int allocation_value;

    /* The plain form loads the fifth integer directly through COP1 and is
     * eight bytes short. Reuse the equivalent word identity proven for the
     * corresponding incoming argument in func_00222190. */
    allocation_value = z1 | x1;
    z1 = allocation_value & z1;

    destination[0] = (float)x1;
    destination[1] = 0.0f;
    destination[2] = (float)z1;
    origin[0] = (float)x0;
    origin[1] = 0.0f;
    origin[2] = (float)z0;
    distance = vec3_distance(destination, origin);
    distance /= func_002016F4(actor->primary_class_id.word, actor->secondary_class_id.word);
    return (int)distance;
}
