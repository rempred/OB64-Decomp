#include "game/battle_resolution_record.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;

typedef struct ResolutionContext {
    int field00;
    int field04;
    int field08;
    int unknown0C;
    u8 unknown10[0x800];
    int field810;
    int field814;
    u8 field818;
    u8 field819;
    u8 unknown81A[8];
    u8 field822;
    u8 field823;
    u8 unknown824[4];
    u32 field828;
} ResolutionContext;

extern ResolutionContext *D_801CE8C0;
extern u8 *D_801CE8BC;
extern u8 D_801939CC;
extern void func_0021088C(void);
extern void func_00210930(void);
extern void func_00023780(void *, u32);
extern void *battle_roster_lookup_actor(unsigned int index);
struct Opt1F;
extern struct Opt1F *func_001F21A4(int);
extern int func_0020BF7C(void);
/* The getter produces a full zero-extended word, as declared by its existing callers. */
extern int func_0020BF8C(void);
extern int func_0020F8DC(void);
extern int func_0020F80C(void);
extern int func_002335E0(int);
extern int func_0023370C(void);
extern int func_00232458(u8 *, int *);
extern int func_002317C8(int *, int);
extern int func_0022F2BC(void *, int *);
extern void func_0021D1CC(int, int);

/*
 * An inline parameter keeps these two output addresses as direct call arguments.
 * A separate early address invariant changes LOOP hoisting and the saved frame.
 */
static inline void resolve_side(int *outTime, int side)
{
    func_002317C8(outTime, side);
}

void func_00232D7C(void)
{
    struct {
        BattleResolutionRecord records[6];
        int outTime;
    } work;
    BattleResolutionRecord selected;
    BattleRosterRecord *actor;
    ResolutionContext *initialContext;
    ResolutionContext *finalContext;
    ResolutionContext *clearContext;
    u8 *global;
    u8 *descriptor;
    int i;
    int maximum;
    int stopped;
    int oldRetry;
    int empty;
    int retries;
    u16 descriptorIndex;
    u32 globalTime;
    u32 finalTime;
    /* Sharing the count/time scalar preserves its saved register across these phases. */
    int savedValue;

    func_0021088C();
    D_801CE8C0->field823 = 0;
    D_801CE8C0->field822 = 0;
    initialContext = D_801CE8C0;
    initialContext->field818 = 0;
    initialContext->field819 = 0;
    global = D_801CE8BC;
    initialContext->field814 = 0;
    initialContext->field828 = 0;
    initialContext->field00 = 0;
    global[0x6088] = 0;
    clearContext = D_801CE8C0;
    *(u16 *)(global + 0x606A) = 0;
    func_00023780(clearContext->unknown10, 0x800);
    for (i = 0; i < 20; ++i) {
        actor = battle_roster_lookup_actor(i);
        if (actor != 0)
            actor->scheduled_time = 0;
    }

    descriptorIndex = *(u16 *)(D_801CE8BC + 0x6076);
    work.outTime = 0;
    if (descriptorIndex != 0) {
        descriptor = (u8 *)func_001F21A4(descriptorIndex & 0xFF);
        /* The original has no local bit-index guard; its byte domain is upstream. */
        D_801939CC &= ~(1u << descriptor[0]);
        func_00232458(descriptor, &work.outTime);
        *(u16 *)(D_801CE8BC + 0x6076) = 0;
    }

    for (;;) {
        if (D_801CE8BC[0x6087] != 0 || func_0020F8DC() != 0)
            break;
        func_00231CC0(work.records);
        func_00232280(work.records);
        stopped = 0;
        retries = 3;
        do {
            if (work.records[0].actors[0] != 0) {
                empty = work.records[0].actors[0] == 0;
                goto record_ready;
            }
            D_801CE8C0->field00++;
            {
                int firstQuantity;
                int secondQuantity;
                int side;
                int complete;
                if (func_0020BF8C() == 0) {
                    if (func_0020BF7C() == 0) {
                        firstQuantity = func_002335E0(0);
                        secondQuantity = func_002335E0(1);
                        savedValue = (firstQuantity != 0) + (secondQuantity != 0);
                    } else {
                        savedValue = 0;
                    }
                } else {
                    savedValue = 0;
                }
                if (savedValue == 0) {
                    complete = 0;
                    goto missing_head_checked;
                }
                side = func_0023370C();
                resolve_side(&work.outTime, side);
                if (func_0020F8DC() != 0) {
                    complete = 1;
                    goto missing_head_checked;
                }
                if (savedValue == 2) {
                    resolve_side(&work.outTime, side == 0);
                    if (func_0020F8DC() != 0) {
                        complete = 1;
                        goto missing_head_checked;
                    }
                }
                complete = 0;
missing_head_checked:
                if (complete) {
                    stopped = 1;
                    break;
                }
            }
            func_00231CC0(work.records);
            /* Test before decrement: the missing-head path may run four times. */
            oldRetry = retries;
            --retries;
        } while (oldRetry);
        empty = work.records[0].actors[0] == 0;
record_ready:
        if (empty | stopped)
            break;
        selected = work.records[0];
        if (func_00230A9C(&selected, &work.outTime) != 0 ||
            func_0022F580(&selected, &work.outTime) != 0) {
            if (func_0020F8DC() != 0)
                break;
            continue;
        }
        if (selected.actors[0] == 0)
            continue;
        func_0022F2BC(selected.actors[0], &work.outTime);
        if (func_0020F8DC() != 0)
            break;
        if (selected.actors[1] == 0)
            continue;
        func_0022F2BC(selected.actors[1], &work.outTime);
        if (func_0020F8DC() != 0)
            break;
        if (selected.actors[2] == 0)
            continue;
        func_0022F2BC(selected.actors[2], &work.outTime);
        if (func_0020F8DC() != 0)
            break;
    }

    maximum = 0;
    for (i = 0; i < 20; ++i) {
        actor = battle_roster_lookup_actor(i);
        if (actor != 0 && maximum < actor->scheduled_time)
            maximum = actor->scheduled_time;
        finalTime = maximum;
    }
    globalTime = D_801CE8C0->field828;
    if (globalTime >= finalTime)
        finalTime = globalTime;
    savedValue = finalTime;
    D_801CE8BC[0x6086] = 0;
    if ((func_0020BF7C() != 0 || func_0020BF8C() != 0) &&
        (func_0020F80C() != 0 || D_801CE8BC[0x6087] != 0))
        D_801CE8BC[0x6086] = 1;
    func_0021D1CC(0x41, (u32)savedValue + 20);
    func_00210930();
    finalContext = D_801CE8C0;
    finalContext->field823 = 0;
    finalContext->field810 = 0;
    finalContext->field04 = 0;
    finalContext->field08 = 0;
    D_801CE8C0->field822 = 0;
    D_801CE8C0->field00 = 0;
}
