#ifndef COMBAT_POSE_RECORD_H
#define COMBAT_POSE_RECORD_H

#include "combat_types.h"

/* Common decoded prefix written by func_00205484 and func_00205608. */
typedef struct CombatPoseRecord {
    int field_00;
    int field_04;
    int field_08;
    int field_0C;
    int field_10;
    int field_14;
    float field_18;
    float field_1C;
} CombatPoseRecord;

typedef struct CombatPoseIndexedRecord {
    CombatPoseRecord record;
    unsigned char index;
} CombatPoseIndexedRecord;

/* Preserve the bounds callers' 0x28-byte local buffer. The image lookup
 * can access the +0x20 index when the decoded flags select it. */
typedef union CombatPoseScratch {
    CombatPoseRecord record;
    CombatPoseIndexedRecord indexed;
    int storage[10];
} CombatPoseScratch;

extern int func_00205608(int handle, int directoryIndex, u32 selected,
                       CombatPoseRecord *out);

void *func_00206340(int a, int b, CombatPoseIndexedRecord *request,
                   int d, int c, int variant, unsigned char *valueOut);

#endif
