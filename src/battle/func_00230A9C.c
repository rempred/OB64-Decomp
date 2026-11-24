#include "game/battle_panel_record.h"

#include "game/battle_resolution_record.h"

#include "game/combat_selector.h"
#include "game/combat_evaluator.h"
#include "game/battle_record_flag.h"

typedef unsigned long long u64;

typedef struct A9CObject {
    u8 *primary_children[3];
    u8 unknown0C[0x3C];
    int primary_class_id;
    int secondary_class_id;
    u8 unknown50[7];
    u8 formation_column_low;
    u8 unknown58[3];
    u8 formation_row_low;
    int world_x;
    u8 unknown60[4];
    int world_z;
    int target_actor_index;
    int actions_used;
    int action_limit;
    u8 unknown74[8];
    u32 action_id;
    u8 unknown80[4];
    int field84;
    int field88;
    int field8C;
    u8 unknown90[4];
    int scheduled_time;
} A9CObject;

typedef struct A9CContext {
    int field00;
    u8 unknown04[0x814];
    u8 field818;
    u8 unknown819[0xF];
    int field828;
} A9CContext;

typedef struct A9CStateBlock { int words[4]; } A9CStateBlock;

/* Preserve the observed output/state adjacency, including evaluator writes
 * into the copied state. The 8-byte clear does not prove an output bound;
 * behavior beyond these 88 observed bytes remains a data-domain question. */
typedef union A9CWork {
    int words[22];
    struct {
        int output[2];
        union {
            A9CStateBlock blocks[5];
            Func001F0E64Record record;
            Panel1F panel;
            Func001F197CState evaluator;
        } state;
    } fields;
} A9CWork;

extern A9CContext *D_801CE8C0;
/* The ten accessed words span both existing original data owners. */
extern const float D_801F68D0[];
extern void func_00023780(void *, u32);
extern unsigned int func_00022e60(void);
extern int rand(void);
extern int func_000454E0(int);
extern void *battle_roster_lookup_actor(unsigned int index);
extern int func_0022F2BC(void *, int *);
extern int func_0020F8DC(void);
extern void func_0022EF50(void *);
extern int func_0020BFE4(void);
extern u16 func_0020C448(void *);
extern u8 func_00201584(int, int);
extern int func_00201798(int, int, int, int);
extern void func_0021D200(int, int, void *);
extern void func_0021D230(int, int, void *, int);
extern void func_0021D25C(int, int, void *, int, int);
extern void func_0021D28C(int, int, void *, int, int, int);
extern void func_0021D2C0(int, int, void *, int, int, int, int);
extern int battle_roster_find_actor_index(void *);
extern int func_002361EC(A9CObject *);
int func_002363FC(BattleRosterRecord *);
int func_002365BC(BattleRosterRecord *, BattleRosterRecord *, int, int);
int func_00235754(BattleRosterRecord *, BattleRosterRecord *);
extern int func_0023697C(A9CObject *, A9CObject *, float, int, int, int);
extern int func_0022A4E0(void *);
extern void func_0022ADFC(void *, int, int, int, int, u8, int, int);

int func_00230A9C(BattleResolutionRecord *input, int *outTime)
{
    int raw[3];
    A9CObject *selected[3];
    int scheduled[3];
    int values[3];
    A9CWork work;
    A9CObject *object;
    A9CObject *firstDestination;
    int firstResult;
    A9CObject *target;
    A9CObject *pendingTarget;
    A9CObject *excluded;
    A9CStateBlock *source;
    A9CStateBlock *sourceEnd;
    A9CStateBlock *destination;
    A9CStateBlock *failureState;
    A9CStateBlock *failureSourceEnd;
    u32 selectedCount;
    u32 i;
    u32 j;
    int base;
    int publication;
    int objectTime;
    int deficitObjectTime;
    int publicationTime;
    int narrowed;
    int firstEvaluation;
    int duration;
    /* Separate single-definition operands preserve retail call scheduling. */
    int firstOperand;
    int innerOperand;
    int innerResult;
    int threshold;
    int decision;
    int rawMode;
    int selector;
    int startTime;
    int endTime;
    int endpoint;
    int successExtra;
    int failureExtra;
    int subtype;
    int hitCount;
    int randomWord;
    int secondEvaluation;
    int followup;
    int failureSelector;
    int auxiliary;
    int helperResult;
    u32 first;
    u32 second;
    u32 third;
    u32 mixed;
    int result;
    int auxiliaryGuard;
    float rounded;
    u8 formation_column_low;
    u8 formation_row_low;

    func_00023780(work.words, 8);
    auxiliaryGuard = 0;
    for (i = 0; i < 3; ++i) {
        raw[i] = -1;
        if (battle_actor_secondary_class_is_one(input->actors[i]) == 0)
            continue;
        if (battle_actor_is_absent_or_has_flag_0(input->actors[i]) != 0)
            continue;
        if (battle_actor_has_flag_1(input->actors[i]) != 0)
            continue;
        if (battle_actor_has_flag_3(input->actors[i]) != 0)
            continue;
        if (battle_actor_has_flag_2(input->actors[i]) != 0)
            continue;
        if (((A9CObject *)input->actors[i])->actions_used != D_801CE8C0->field00)
            continue;
        if (((A9CObject *)input->actors[i])->actions_used >= ((A9CObject *)input->actors[i])->action_limit)
            continue;
        firstResult = func_00233ED4(input->actors[i]);
        firstDestination = ((A9CObject *)input->actors[i]);
        raw[i] = firstResult;
        firstDestination->target_actor_index = firstResult;
    }

    if (raw[0] != -1 && raw[0] == raw[1] && raw[0] == raw[2]) {
        for (i = 0; i < 3; ++i)
            selected[i] = ((A9CObject *)input->actors[i]);
        selectedCount = 3;
        pendingTarget = battle_roster_lookup_actor(raw[0]);
        target = pendingTarget;
    } else {
        if (raw[0] != -1 && raw[0] == raw[1]) {
            raw[2] = -1;
            selected[0] = (A9CObject *)input->actors[0];
            selected[1] = (A9CObject *)input->actors[1];
            pendingTarget = battle_roster_lookup_actor(raw[0]);
            excluded = (A9CObject *)input->actors[2];
        } else if (raw[0] != -1 && raw[0] == raw[2]) {
            raw[1] = -1;
            selected[0] = (A9CObject *)input->actors[0];
            selected[1] = (A9CObject *)input->actors[2];
            pendingTarget = battle_roster_lookup_actor(raw[0]);
            excluded = (A9CObject *)input->actors[1];
        } else {
            if (raw[1] == -1 || raw[1] != raw[2])
                return 0;
            raw[0] = -1;
            selected[0] = (A9CObject *)input->actors[1];
            selected[1] = (A9CObject *)input->actors[2];
            pendingTarget = battle_roster_lookup_actor(raw[1]);
            excluded = (A9CObject *)input->actors[0];
        }
        selectedCount = 2;
        target = pendingTarget;
        if (excluded != 0) {
            func_0022F2BC(excluded, outTime);
            if (func_0020F8DC() != 0)
                return 1;
        }
    }
    if (func_0020D814(selected[0]) == 1)
        return 0;
    if (battle_actor_is_absent_or_has_flag_0(target) != 0)
        return 0;
    formation_column_low = target->formation_column_low;
    formation_row_low = target->formation_row_low;
    for (i = 0; i < selectedCount; ++i)
        func_0022EF50(selected[i]);

    if ((u32)target->scheduled_time < (u32)*outTime)
        base = *outTime;
    else
        base = target->scheduled_time;
    if (func_0020BFE4() != 0) {
        for (i = 0; i < selectedCount; ++i) {
            values[i] = func_0022222C((BattleRosterRecord *)selected[i], (BattleRosterRecord *)target,
                                     selected[i]->world_x, selected[i]->world_z);
            scheduled[i] = base - values[i];
        }
    } else {
        for (i = 0; i < selectedCount; ++i) {
            values[i] = 0;
            scheduled[i] = base;
        }
    }
    base = 0;
    for (i = 0; i < selectedCount; ++i) {
        deficitObjectTime = selected[i]->scheduled_time;
        if (scheduled[i] < deficitObjectTime && base < deficitObjectTime - scheduled[i])
            base = deficitObjectTime - scheduled[i];
    }
    D_801CE8C0->field818++;
    if (selectedCount != 0) {
        i = 0;
        do {
            scheduled[i] += base;
            object = selected[i];
            publicationTime = object->scheduled_time;
            if (publicationTime < scheduled[i])
                publicationTime = scheduled[i];
            object->scheduled_time = publicationTime;
            if ((u32)D_801CE8C0->field828 < (u32)publicationTime)
                publication = publicationTime;
            else
                publication = D_801CE8C0->field828;
            object->scheduled_time = publication;
            func_0021D200(0x1C, publication, object);
            object->actions_used++;
            scheduled[i] = object->scheduled_time;
            ++i;
        } while (i < selectedCount);
    }
    narrowed = func_000454E0((u16)func_0020C448(selected[0]));
    for (i = 0; i < selectedCount; ++i)
        func_0021D230(0x3E, scheduled[i], selected[i], (u8)narrowed);

    if (func_0020BFE4() != 0) {
        for (i = 0; i < selectedCount; ++i)
            func_0021D28C(3, scheduled[i], selected[i], 0xFF,
                         selected[i]->target_actor_index, 5);
        source = (A9CStateBlock *)(selected[0]->primary_children[0] + 0x44);
        sourceEnd = (A9CStateBlock *)(selected[0]->primary_children[0] + 0x94);
        destination = work.fields.state.blocks;
        do {
            *destination++ = *source++;
        } while (source != sourceEnd);
        func_001F0E64(&work.fields.state.record, 6);
        base = func_001F197C(selected[0], &work.fields.state.evaluator, 0);
        for (i = 0; i < selectedCount; ++i) {
            func_0021D25C(5, scheduled[i] + values[i], selected[i], 0xFF, 6);
            values[i] += base;
        }
    }

    firstOperand = func_002361EC(selected[0]);
    threshold = func_002363FC((BattleRosterRecord *)target);
    /* The cutoff is consumed before this word becomes the decision. */
    decision = func_002365BC((BattleRosterRecord *)selected[0], (BattleRosterRecord *)target,  firstOperand,  threshold);
    first = rand();
    second = rand();
    third = rand();
    mixed = ((first << 18) & 0x0C000000U) | (second << 15) | third;
    mixed %= 100U;
    decision = mixed < (u32)decision;
    source = (A9CStateBlock *)(selected[0]->primary_children[0] + 0x44);
    sourceEnd = (A9CStateBlock *)(selected[0]->primary_children[0] + 0x94);
    destination = work.fields.state.blocks;
    do {
        *destination++ = *source++;
    } while (source != sourceEnd);
    rawMode = 0;
    if (decision == 0) {
        if (func_00201584(target->primary_class_id, target->secondary_class_id) != 0)
            rawMode = 2;
        else
            rawMode = 1;
    }
    selector = (u8)func_00201798(selected[0]->primary_class_id, selected[0]->secondary_class_id,
                                selected[0]->action_id, rawMode);
    func_001F0E64(&work.fields.state.record, selector);
    duration = func_001F197C(selected[0], &work.fields.state.evaluator, work.words);
    if (func_0020BFE4() == 0) {
        duration = 15;
        work.words[0] = 10;
    }
    for (i = 0; i < selectedCount; ++i) {
        if (func_0020BFE4() != 0) {
            if (decision != 0)
                func_0021D28C(6, scheduled[i] + values[i], selected[i], 0xFF,
                             selector, selected[i]->action_id);
            else
                func_0021D28C(7, scheduled[i] + values[i], selected[i], 0xFF,
                             selector, selected[i]->action_id);
        } else {
            if (decision != 0)
                func_0021D28C(6, scheduled[i], selected[i], 0,
                             0, selected[i]->action_id);
            else
                func_0021D28C(7, scheduled[i], selected[i], 0,
                             0, selected[i]->action_id);
        }
    }
    startTime = scheduled[0] + values[0];
    endTime = startTime + duration;
    endpoint = startTime + work.words[0] - 5;
    if (decision != 0) {
        if (func_0020BFE4() != 0) {
            helperResult = battle_roster_find_actor_index(selected[0]);
            func_0021D2C0(0x17, endpoint, 0, 0x5D, (u8)narrowed,
                         helperResult, selected[0]->target_actor_index);
        }
        if (endpoint < startTime)
            startTime = endpoint;
        successExtra = func_0020BFE4() != 0 ? 25 : 5;
        if (endTime < successExtra + endpoint)
            endTime = successExtra + endpoint;
    } else if (func_00201584(target->primary_class_id, target->secondary_class_id) != 0) {
        subtype = battle_actor_is_side_one(target) != 0 ? 0x60 : 0x5F;
        if (func_0020BFE4() != 0) {
            helperResult = battle_roster_find_actor_index(selected[0]);
            func_0021D2C0(0x17, endpoint, 0, subtype, (u8)narrowed,
                         helperResult, selected[0]->target_actor_index);
        }
        if (endpoint < startTime)
            startTime = endpoint;
        failureExtra = func_0020BFE4() != 0 ? 15 : 5;
        if (endTime < endpoint + failureExtra)
            endTime = endpoint + failureExtra;
    }

    if (decision != 0) {
        hitCount = 0;
        for (i = 0; i < selectedCount; ++i) {
            for (j = 0; j < 3; ++j) {
                if (selected[i]->primary_children[j] != 0) {
                    innerOperand = func_002361EC(selected[0]);
                    threshold = func_002363FC((BattleRosterRecord *)target);
                    innerResult = func_002365BC((BattleRosterRecord *)selected[0], (BattleRosterRecord *)target, 
                                              innerOperand,  threshold);
                    randomWord = (int)func_00022e60();
                    randomWord %= 100;
                    hitCount += randomWord < innerResult;
                }
            }
        }
        rounded = (float)(int)((float)func_00235754((BattleRosterRecord *)selected[0], (BattleRosterRecord *)target) *
                              D_801F68D0[hitCount]);
        /* Retail has a zero guard separate from the one-word result.
         * The guard's original source-level purpose is unknown. */
        result = func_0023697C(selected[0], target, rounded, 0, 0, 0);
        if (auxiliaryGuard != 0)
            auxiliary = func_0022A4E0(target);
        else
            auxiliary = 0;
        func_0022ADFC(target, 0, scheduled[0] + values[0] + work.words[0],
                     result, 0, 0, 1, auxiliary);
        if (endTime < target->scheduled_time)
            endTime = target->scheduled_time;
    } else {
        followup = (u8)func_00201584(target->primary_class_id, target->secondary_class_id);
        source = (A9CStateBlock *)(target->primary_children[0] + 0x44);
        sourceEnd = (A9CStateBlock *)(target->primary_children[0] + 0x94);
        destination = work.fields.state.blocks;
        do {
            *destination++ = *source++;
        } while (source != sourceEnd);
        failureState = work.fields.state.blocks;
        func_001F0E04(&work.fields.state.panel, followup == 0 ? 0x17 : 0x15);
        firstEvaluation = func_001F197C(target, &work.fields.state.evaluator, 0);
        func_0021D230(0xE, scheduled[0] + values[0] + work.words[0], target, 0xFF);
        objectTime = scheduled[0] + values[0] + work.words[0] + firstEvaluation;
        source = (A9CStateBlock *)(target->primary_children[0] + 0x44);
        failureSourceEnd = (A9CStateBlock *)(target->primary_children[0] + 0x94);
        do {
            *failureState++ = *source++;
        } while (source != failureSourceEnd);
        failureSelector = 0x18;
        failureState = work.fields.state.blocks; /* Keeps the state-address load in the retail branch delay slot. */
        if (followup != 0)
            failureSelector = 0x16;
        func_001F0E64(&work.fields.state.record, failureSelector);
        secondEvaluation = func_001F197C(target, &work.fields.state.evaluator, 0);
        func_0021D230(0xF, objectTime, target, 0xFF);
        firstEvaluation += secondEvaluation;
        if (target->scheduled_time < objectTime + firstEvaluation)
            target->scheduled_time = objectTime + firstEvaluation;
        if (endTime < target->scheduled_time)
            endTime = target->scheduled_time;
    }
    for (i = 0; i < selectedCount; ++i) {
        secondEvaluation = 0;
        if (func_0020BFE4() != 0) {
            secondEvaluation = func_002223E0((BattleRosterRecord *)selected[i], (BattleRosterRecord *)target, formation_column_low, formation_row_low,
                                             selected[i]->world_x, selected[i]->world_z);
            func_0021D25C(8, scheduled[i] + values[i] + duration, selected[i], 0xFF, 11);
            func_0021D25C(9, scheduled[i] + values[i] + duration + secondEvaluation,
                         selected[i], 0xFF, 12);
        }
        selected[i]->field84 = values[i];
        selected[i]->field88 = endTime - startTime;
        selected[i]->field8C = duration + secondEvaluation - selected[i]->field88;
        if (selected[i]->field8C < 0)
            selected[i]->field8C = 0;
        selected[i]->scheduled_time = scheduled[i] + values[i] + duration + secondEvaluation;
    }
    *outTime = scheduled[0] + selected[0]->field84 + selected[0]->field88;
    return 1;
}

