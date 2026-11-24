#include "game/battle_roster_record.h"

int func_0020BF50(int value);
int func_0020BF34(int value);
unsigned char func_00201838(int sourceArt, int ownerContext);
unsigned char func_002018A0(int sourceArt, int ownerContext);
float vec3_distance(const float origin[3], const float destination[3]);
float func_002016F4(int sourceArt, int ownerContext);

int func_002223E0(BattleRosterRecord *actor, BattleRosterRecord *target, int formation_column, int formation_row, int x, int z)
{
    float origin[3];
    float destination[3];
    int target_x;
    int target_z;
    unsigned char sourceAdjustment;
    unsigned char targetAdjustment;
    int adjustment;
    float distance;

    target_x = func_0020BF50(formation_row);
    target_z = func_0020BF34(formation_column);
    origin[0] = (float)x;
    origin[1] = 0.0f;
    origin[2] = (float)z;
    destination[0] = (float)target_x;
    destination[1] = 0.0f;
    destination[2] = (float)target_z;
    distance = vec3_distance(origin, destination);
    sourceAdjustment = func_00201838(actor->primary_class_id.word, actor->secondary_class_id.word);
    targetAdjustment = func_002018A0(target->primary_class_id.word, target->secondary_class_id.word);
    adjustment = (int)sourceAdjustment + (int)targetAdjustment;
    distance -= (float)adjustment;
    distance /= func_002016F4(actor->primary_class_id.word, actor->secondary_class_id.word);
    return (int)distance;
}
