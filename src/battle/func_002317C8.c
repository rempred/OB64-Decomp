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
extern int func_0020C2C0(SideObject *);
extern void func_00023780(void *, u32);
extern void func_0020D870(SideObject *, int);
extern u8 func_00043b2c(int, int);
extern int func_00237750(SideObject *, SideObject *, int, int, int);
extern int func_002331AC(const void *, const void *);
extern void func_002101DC(void *, int, int, int (*)(const void *, const void *));
extern void func_0021D2C0(int, int, void *, int, int, int, int);
extern void func_0021D230(int, int, void *, int);
extern int func_002344B4(SideObject *, int);
extern void func_0022ADFC(SideObject *, int, int, int, int, u8, int, int);

int func_002317C8(int *outTime, int selector)
{
    SideObject temporary;
    SideObject *allocated[4];
    /* Six is a storage hypothesis, not a proved selected-count bound.
       Preserve the original uncapped scan and all consumers. */
    SideObject *selected[6];
    int rawIndex[4];
    int prior[6];
    int calculated[6];
    int duration[6];
    int difference;
    SideObject *object;
    SideObject *selectionObject;
    SideObject *freeObject;
    SideObject *publicationObject;
    SideContext *context;
    u8 *global;
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
    if ((u32)selector > (u32)difference)
        bit = D_801CE8C0->field82E & 2;
    else
        bit = D_801CE8C0->field82E & 1;
    if (bit != 0)
        return 0;
    quantity = func_002335E0(selector);
    countOrAmount = 0;
    if ((u32)countOrAmount >= (u32)quantity)
        return 0;
    for (i = 0; i < 20; ++i) {
        selectionObject = func_0020C478(i);
        if (func_0020C2C0(selectionObject) != 0)
            continue;
        if (selector != 0)
            accepted = func_0020C014(selectionObject);
        else
            accepted = func_0020BFF8(selectionObject);
        if (accepted != 0) {
            selected[countOrAmount] = selectionObject;
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
    func_00023780(&temporary, 0xF8);
    if (selector != 0) {
        func_0020C908(&temporary.roster, 0);
        context = D_801CE8C0;
        bit = context->field82E | 2;
        context->field82E = bit;
    } else {
        func_0020D870(&temporary, 0);
        context = D_801CE8C0;
        bit = context->field82E | 1;
        context->field82E = bit;
    }
    temporary.roster.field78 = 0;
    temporary.roster.field7C = func_00043b2c(1, 1) & 0xFF;
    countOrAmount = (int)(((float)((count + 5) / (count * 2)) *
                        (float)quantity) / 12.0f);
    maximum = *outTime;
    for (i = 0; i < count; ++i) {
        if (maximum < selected[i]->roster.field94)
            maximum = selected[i]->roster.field94;
        value = countOrAmount * func_00237750(&temporary, selected[i], 0, 0, 0);
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
    global = D_801CE8BC;
    for (; i < 20; ++i, offset += 0xF8) {
        freeObject = (SideObject *)(global + offset);
        if (freeObject->roster.class48.word == 0) {
            allocated[objectDuration] = freeObject;
            rawIndex[objectDuration] = i;
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
                     chunk, selector, i);
        func_0021D230(0x3C, maximum + 45, allocated[i], 0xFF);
        quantity = remaining;
    }
    maximum += 45;
    if (selector != 0)
        temporary.roster.row58 = 14;
    else
        temporary.roster.row58 = -6;
    /* Keep the capture, index reset and unconditional copy separate.
       The explicit positive-count entry avoids KMC folding the index test
       and moving its reset past the return-value capture. */
    capturedDuration = func_002344B4(&temporary, 15);
    i = 0;
    objectDuration = capturedDuration;
    if (count > 0) {
        do {
            object = selected[i];
            duration[i] = func_002344B4(object, 15);
            stepValue = calculated[i];
            prior[i] = object->roster.field94;
            stepTime = maximum + duration[i];
            func_0022ADFC(object, 0, stepTime, stepValue, 0, 0, 1, 0);
            ++i;
        } while (i < count);
    }
    for (i = 0; i < requested; ++i) {
        publicationObject = allocated[i];
        difference = objectDuration - duration[0];
        func_0021D230(0x3D, maximum + objectDuration, publicationObject, 0xFF);
    }
    *outTime = maximum + duration[0] + difference;
    for (i = 0; i < count; ++i) {
        object = selected[i];
        previousDifference = object->roster.field94 - prior[i];
        if (previousDifference < difference)
            object->roster.field94 += difference - previousDifference;
        previousDifference = object->roster.field94;
        currentTime = *outTime;
        if (currentTime < (u32)previousDifference)
            *outTime = previousDifference;
        else
            object->roster.field94 = currentTime;
    }
    return 1;
}
