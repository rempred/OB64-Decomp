#include "game/battle_record_flag.h"

#include "game/battle_record_flag.h"

typedef unsigned char u8;
typedef unsigned int u32;

#include "game/battle_roster_record.h"

/* The side routines keep their existing object interface. The copy
 * initializes the complete roster record held by this object. */
typedef struct SideObject {
    BattleRosterRecord roster;
} SideObject;

typedef struct SideContext {
    u8 unknown00[0x818];
    u8 field818;
    u8 unknown819[0x15];
    u8 field82E;
} SideContext;

extern SideContext *D_801CE8C0;
extern u8 *D_801CE8BC;
extern int func_002335E0(int);
extern void *func_0020C478(unsigned int index);
extern void func_00023780(void *, u32);
extern void func_0020D870(BattleRosterRecord *, int);
extern u8 func_00043b2c(int, int);
extern int func_002331AC(const void *, const void *);
extern void func_002101DC(void *, int, int, int (*)(const void *, const void *));
extern void func_0021D2C0(int, int, void *, int, int, int, int);
extern void func_0021D230(int, int, void *, int);
extern int func_002344B4(BattleRosterRecord *, int);
extern void func_0022ADFC(void *, int, int, int, int, u8, int, int);

int func_002317C8(int *outTime, int side_selector)
{
    SideObject temporary_actor;
    SideObject *allocated[4];
    /* Six is a storage hypothesis, not a proved selected-count bound.
       Preserve the original uncapped scan and all consumers. */
    SideObject *selected[6];
    int free_actor_indices[4];
    int prior[6];
    int calculated[6];
    int duration[6];
    int difference;
    SideObject *actor;
    SideObject *candidate_actor;
    SideObject *free_actor;
    SideObject *scheduled_actor;
    SideContext *context;
    u8 *scene_bytes;
    int quantity;
    /* The growing count dies at its snapshot; this word then holds the scale. */
    int countOrAmount;
    int count;
    int requested;
    int i;
    int accepted;
    int bit;
    int value;
    int clamped;
    int maximum;
    int offset;
    int chunk;
    int remaining;
    /* Free-record count dies before this word becomes the object duration. */
    int objectDuration;
    int capturedDuration;
    int stepTime;
    int stepValue;
    /* Signed prior difference dies before the reloaded field is compared unsigned. */
    int previousDifference;
    u32 currentTime;

    difference = 0;
    /* difference is still zero: this tests every nonzero 32-bit selector.
       KMC retains this comparison allocation after folding the test,
       preserving the retail frame without another emitted instruction. */
    if ((u32)side_selector > (u32)difference)
        bit = D_801CE8C0->field82E & 2;
    else
        bit = D_801CE8C0->field82E & 1;
    if (bit != 0)
        return 0;
    quantity = func_002335E0(side_selector);
    countOrAmount = 0;
    if ((u32)countOrAmount >= (u32)quantity)
        return 0;
    for (i = 0; i < 20; ++i) {
        candidate_actor = func_0020C478(i);
        if (func_0020C2C0(candidate_actor) != 0)
            continue;
        if (side_selector != 0)
            accepted = func_0020C014(candidate_actor);
        else
            accepted = func_0020BFF8(candidate_actor);
        if (accepted != 0) {
            selected[countOrAmount] = candidate_actor;
            ++countOrAmount;
        }
    }
    count = countOrAmount;
    if (count == 0)
        return 0;

    requested = 1;
    if ((u32)(quantity - 1) >= 3) {
        if ((u32)(quantity - 4) < 3)
            requested = 2;
        else {
            requested = 4;
            if ((u32)(quantity - 7) < 3)
                requested = 3;
        }
    }
    func_00023780(&calculated[0], 20);
    func_00023780(&duration[0], 20);
    func_00023780(&prior[0], 20);
    func_00023780(&temporary_actor, 0xF8);
    if (side_selector != 0) {
        func_0020C908(&temporary_actor.roster, 0);
        context = D_801CE8C0;
        bit = context->field82E | 2;
        context->field82E = bit;
    } else {
        func_0020D870(&temporary_actor.roster, 0);
        context = D_801CE8C0;
        bit = context->field82E | 1;
        context->field82E = bit;
    }
    temporary_actor.roster.action_kind = 0;
    temporary_actor.roster.action_id = func_00043b2c(1, 1) & 0xFF;
    countOrAmount = (int)(((float)((count + 5) / (count * 2)) *
                        (float)quantity) / 12.0f);
    maximum = *outTime;
    for (i = 0; i < count; ++i) {
        if (maximum < selected[i]->roster.scheduled_time)
            maximum = selected[i]->roster.scheduled_time;
        value = countOrAmount * func_00237750(&temporary_actor.roster, &selected[i]->roster, 0, 0, 0);
        calculated[i] = value;
        if (value <= 0)
            value = 1;
        clamped = value;
        if (clamped >= 10000)
            clamped = 9999;
        calculated[i] = clamped;
    }

    D_801CE8C0->field818++;
    objectDuration = 0;
    i = 0;
    offset = 0x1C4;
    scene_bytes = D_801CE8BC;
    for (; i < 20; ++i, offset += 0xF8) {
        free_actor = (SideObject *)(scene_bytes + offset);
        if (free_actor->roster.primary_class_id.word == 0) {
            allocated[objectDuration] = free_actor;
            free_actor_indices[objectDuration] = i;
            ++objectDuration;
            if (objectDuration == requested)
                break;
        }
    }
    func_002101DC(&selected[0], count, 4, func_002331AC);
    for (i = 0; i < requested; ++i) {
        remaining = quantity - 3;
        chunk = 3;
        if (remaining < 0)
            chunk = quantity;
        func_0021D2C0(0x3B, maximum, allocated[i], 0xFF,
                     chunk, side_selector, i);
        func_0021D230(0x3C, maximum + 45, allocated[i], 0xFF);
        quantity = remaining;
    }
    maximum += 45;
    if (side_selector != 0)
        temporary_actor.roster.formation_row = 14;
    else
        temporary_actor.roster.formation_row = -6;
    /* Keep the capture, index reset and unconditional copy separate.
       The explicit positive-count entry avoids KMC folding the index test
       and moving its reset past the return-value capture. */
    capturedDuration = func_002344B4(&temporary_actor.roster, 15);
    i = 0;
    objectDuration = capturedDuration;
    if (count > 0) {
        do {
            actor = selected[i];
            duration[i] = func_002344B4(&actor->roster, 15);
            stepValue = calculated[i];
            prior[i] = actor->roster.scheduled_time;
            stepTime = maximum + duration[i];
            func_0022ADFC(actor, 0, stepTime, stepValue, 0, 0, 1, 0);
            ++i;
        } while (i < count);
    }
    for (i = 0; i < requested; ++i) {
        scheduled_actor = allocated[i];
        difference = objectDuration - duration[0];
        func_0021D230(0x3D, maximum + objectDuration, scheduled_actor, 0xFF);
    }
    *outTime = maximum + duration[0] + difference;
    for (i = 0; i < count; ++i) {
        actor = selected[i];
        previousDifference = actor->roster.scheduled_time - prior[i];
        if (previousDifference < difference)
            actor->roster.scheduled_time += difference - previousDifference;
        previousDifference = actor->roster.scheduled_time;
        currentTime = *outTime;
        if (currentTime < (u32)previousDifference)
            *outTime = previousDifference;
        else
            actor->roster.scheduled_time = currentTime;
    }
    return 1;
}
