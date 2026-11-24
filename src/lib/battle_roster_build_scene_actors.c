#include "game/battle_record_flag.h"

#include "game/battle_roster_record.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;

extern void *D_801CE8BC;
extern u8 D_801976E8;
extern u8 D_801971F0[];
extern u8 D_80193BC0[];
extern u8 D_80190F80[];
extern u8 D_80195560[];
extern u8 D_801953F0[];
extern int func_0020D9C4(void *);
extern void func_00023780(void *, u32);
extern void func_001F0F6C(void *);
extern void func_001F102C(void *);
extern void func_001F114C(void *);
extern u8 func_00043dc4(int, int);
extern int func_00044238(int, int, int);
extern int func_00045934(int, int, int, int);
extern int func_002015C8(int, int, int, int);
extern void func_00207658(int *, int *, int *, int *, int *, u32);
extern void func_002073CC(int, int);
extern u8 func_0020D434(int);
extern void func_0020FC7C(BattleRosterRecord *);
extern int func_0021062C(int, int, int);
extern void func_0021088C(void);
extern void func_00210930(void);

#define BYTE(p,o) (*(u8 *)((u8 *)(p) + (o)))
#define HALF(p,o) (*(u16 *)((u8 *)(p) + (o)))
#define WORD(p,o) (*(int *)((u8 *)(p) + (o)))

/* Copy from the persistent character row into the battle actor.
 * The remaining HALF destination forms preserve KMC's original copy order. */
#define COPY_ROW(actor, source, member_index_or_count) { \
    u8 *character_bytes = (source); u8 copied_alignment; int secondary_class_id, classIsOne; \
    func_00023780((actor), 0xF8); \
    actor->primary_class_id.word = BYTE(character_bytes,0x11); \
    secondary_class_id = BYTE(character_bytes,0x12); \
    actor->member_index = (member_index_or_count); \
    actor->secondary_class_id.word = secondary_class_id; \
    actor->level = BYTE(character_bytes,0x13); \
    actor->element = BYTE(character_bytes,0x1A); \
    HALF(actor,0x22) = HALF(character_bytes,0x16); \
    HALF(actor,0x20) = HALF(character_bytes,0x18); \
    HALF(actor,0x24) = HALF(character_bytes,0x1C); \
    HALF(actor,0x26) = HALF(character_bytes,0x1E); \
    HALF(actor,0x28) = HALF(character_bytes,0x20); \
    HALF(actor,0x2A) = HALF(character_bytes,0x22); \
    HALF(actor,0x2C) = HALF(character_bytes,0x24); \
    actor->dexterity = HALF(character_bytes,0x26); \
    actor->luck = BYTE(character_bytes,0x28); \
    copied_alignment = BYTE(character_bytes,0x1B); actor->reference_alignment = copied_alignment; \
    actor->alignment = copied_alignment; \
    HALF(actor,0x36) = HALF(character_bytes,0x2A); \
    actor->equipment_slot_1 = HALF(character_bytes,0x2C); \
    HALF(actor,0x3A) = HALF(character_bytes,0x2E); \
    actor->equipment_slot_3 = HALF(character_bytes,0x30); \
    actor->fatigue = BYTE(character_bytes,0x32); \
    if (!(actor)) { classIsOne = 0; } else { classIsOne = actor->secondary_class_id.word == 1; } \
    if (classIsOne) actor->fatigue = 0; \
    if (BYTE(character_bytes,0x33) & 2) actor->battle_flags |= 0x200; \
    if (BYTE(character_bytes,0x33) & 4) actor->battle_flags |= 2; \
    actor->experience = BYTE(character_bytes,0x35); \
}

/* Each search observes presence, side, and enable in their original order. */
static __inline__ void *find_peer(int inverseSide)
{
    u8 *base = D_801CE8BC;
    u8 *scan = base;
    u32 search = 0;
    int searchOffset = 0;
    do {
        BattleRosterRecord *peer = 0;
        int side, enabled;
        if (search < 20) { int present = ((BattleRosterRecord *)(scan + 0x1C4))->primary_class_id.word; if (present) { int actorOffset = searchOffset + 0x1C4; peer = (BattleRosterRecord *)(base + actorOffset); } }
        if (!peer) side = 0;
        else side = ((peer->battle_flags >> 8) ^ inverseSide) & 1;
        if (side) {
            if (!peer) enabled = 0;
            else enabled = (peer->battle_flags >> 9) & 1;
            if (enabled) return peer;
        }
        scan += 0xF8;
        search++;
        searchOffset += 0xF8;
    } while ((int)search < 20);
    return 0;
}

#define FIND_PEER(actor, inverseSide) { \
    BattleRosterRecord *peer = find_peer(inverseSide); \
    do { \
        if (!peer) break; \
        if ((actor) == peer) break; \
        if (peer->secondary_class_id.word != 0x21) break; \
        if (peer->battle_flags & 1) break; \
        if ((peer->battle_flags >> 1) & 1) break; \
        actor->action_limit = (u8)func_00044238(actor->primary_class_id.bytes.low, actor->secondary_class_id.bytes.low, \
                                          func_0020D434(actor->formation_row) & 255) + 1; \
    } while (0); \
}

/* Queue submission consumes the three pointer positions, not their objects. */
#define SUBMIT_POINTERS(actor) { \
    index = 0; \
    do { \
        if (actor->primary_children[index]) func_001F0F6C(actor->primary_children[index]); \
        if (actor->secondary_children[index]) func_001F102C(actor->secondary_children[index]); \
        index++; \
    } while (index < 3); \
}

static __inline__ void *scene_actor(u32 index, int offset)
{
    u8 *scene;
    if (index >= 20) return 0;
    scene = D_801CE8BC;
    if (!((BattleRosterRecord *)(scene + offset + 0x1C4))->primary_class_id.word) return 0;
    return scene + (offset + 0x1C4);
}
/* Keep the ordinal conversion: it retains GCC's unused predicate slot while
 * the zero-based caller counter shares its register with the later scans. */
static __inline__ void *scene_actor_ordinal(u32 visit, int offset)
{
    u8 *scene;
    visit--;
    if (visit >= 20) return 0;
    scene = D_801CE8BC;
    if (!((BattleRosterRecord *)(scene + offset + 0x1C4))->primary_class_id.word) return 0;
    return scene + (offset + 0x1C4);
}
/* Adjacent half-open bands reuse the boundary already loaded on that path. */
static __inline__ u8 remap_token(float position, u8 input, const double *bands)
{
    double boundary = bands[0];
    if (position >= boundary) {
        boundary = bands[1];
        if (position < boundary) return ((u8 *)0x801CFC98)[input];
    } else boundary = bands[2];
    if (position >= boundary) {
        boundary = bands[3];
        if (position < boundary) return ((u8 *)0x801CFCA4)[input];
    } else boundary = bands[4];
    if (position >= boundary && position < bands[5]) return ((u8 *)0x801CFCB0)[input];
    return input;
}

static __inline__ u16 auxiliary_value(u32 id, u8 *table) { u16 *entry = (u16 *)table; entry += id; return entry[-0x62]; }
static __inline__ u8 token_column(u8 token) { return (u32)token % 3; }
static __inline__ u8 token_row(u8 token) { return (u32)token / 3; }

void battle_roster_build_scene_actors(int selector)
{
    int sources[18], contexts[18];
    u32 resources[18];
    int variants[18], flag10s[18], flag8s[18];
    int latch, actor_count, slot, outputOffset, index;
    BattleRosterRecord *actor;
    u8 *squad_source, *member_record, *special_member_pool;
    /* The member index, resource count and final roster counter reuse one word.
     * Keep the separate byte load for the character initializer argument. */
    u32 member_index_or_count;
    u8 token;
    u32 actor_or_resource_index;

    WORD(D_801CE8BC,0x5124) = (int)func_0020D9C4;
    WORD(D_801CE8BC,0x5128) = -0x11D0;
    WORD(D_801CE8BC,0x512C) = -0x11D0;
    WORD(D_801CE8BC,0x5130) = -0x11D0;
    func_001F0F6C((u8 *)D_801CE8BC + 0x5124);
    actor_count = 0;
    latch = 0;

    if (*(u8 *)0x801976D9) {
        
        slot = 0;
        while (slot < 5) {
            u8 squad_source_index = *(u8 *)0x801976E8; u8 member_index, member_index_arg;
            squad_source = D_801971F0 + squad_source_index * 0x19;
            member_index = (slot + squad_source)[2];
            if (member_index) {
                float position;
                actor = (BattleRosterRecord *)((u8 *)D_801CE8BC + (actor_count * 0xF8 + 0x1C4));
                if (squad_source_index < 30) {
                    member_record = D_80193BC0 + member_index * 0x38;
                    special_member_pool = D_80190F80;
                } else {
                    member_record = D_80195560 + member_index * 0x34;
                    special_member_pool = D_801953F0;
                }
                position = *(float *)0x801976EC;
                token = remap_token(position, (slot + squad_source)[7], (double *)0x801D05E0);
                member_index_arg = (slot + squad_source)[2];
                member_index_or_count = member_index_arg;
                if (member_index_or_count < 100) {
                    if ((HALF(member_record,0x18) != 0) | (selector != 0)) {
                        if (*(u8 *)0x801976E8 < 30) {
                            COPY_ROW(actor, D_80193BC0 + member_index_or_count * 0x38, member_index_or_count);
                        } else {
                            battle_roster_init_actor_from_scenario_member(actor, member_index_arg);
                        }
                        if (!BYTE(D_801CE8BC,0x6084) && (actor->battle_flags & 2)) {
                            func_00023780(actor, 0xF8);
                            goto next_slot_0;
                        }
                        if (actor->primary_class_id.word == 0x87 || actor->primary_class_id.word == 0x88 || actor->primary_class_id.word == 0xA1) {
                            token = (slot + squad_source)[7];
                        }
                        actor->battle_flags |= 0x500;
                        actor->formation_column = token_column(token);
                        actor->formation_row = token_row(token);
                        func_0020CBDC(actor, 0);
                        FIND_PEER(actor, 0);
                        if (actor->primary_class_id.word == 0x87) {
                            SUBMIT_POINTERS(actor);
                            actor_count++;
                            actor = (BattleRosterRecord *)((u8 *)D_801CE8BC + (actor_count * 0xF8 + 0x1C4));
                            battle_roster_init_actor_from_scenario_member(actor, (slot + squad_source)[2]);
                            actor->formation_column = token_column(token);
                            actor->formation_row = token_row(token);
                            func_0020CBDC(actor, 1);
                            actor->action_limit = 0;
                            actor->actions_used = 0;
                        }
                        { int enabled; if (!actor) enabled = 0; else enabled = (actor->battle_flags >> 9) & 1; if (enabled && (func_00043dc4(actor->primary_class_id.bytes.low, actor->secondary_class_id.bytes.low) & 255) == 2) latch = 1; }
                    }
                } else {
                    if (auxiliary_value(member_index_or_count, special_member_pool)) {
                        if (*(u8 *)0x801976E8 < 30) {
                            COPY_ROW(actor, D_80193BC0, 0);
                        } else {
                            battle_roster_init_actor_from_scenario_member(actor, 0);
                        }
                        if (!BYTE(D_801CE8BC,0x6084) && (actor->battle_flags & 2)) {
                            func_00023780(actor, 0xF8);
                            goto next_slot_0;
                        }
                        actor->battle_flags |= 0x500;
                        actor->formation_column = token_column(token);
                        actor->formation_row = token_row(token);
                        actor->member_index = (slot + squad_source)[2];
                        actor->hp = auxiliary_value(actor->member_index, special_member_pool);
                        actor->max_hp = HALF(special_member_pool,2);
                        if (BYTE(special_member_pool + actor->member_index,0x90) & 4) actor->battle_flags |= 2;
                        func_0020CBDC(actor, latch);
                        FIND_PEER(actor, 0);
                    }
                }
                SUBMIT_POINTERS(actor);
                actor_count++;
            }
next_slot_0:
            slot++;
        }
    }

    {
        int roster_index = actor_count;
        latch = 0;
        slot = 0;
        while (slot < 5) {
            u8 squad_source_index = *(u8 *)0x801976DC; u8 member_index, member_index_arg;
            squad_source = D_801971F0 + squad_source_index * 0x19;
            member_index = (slot + squad_source)[2];
            if (member_index) {
                float position;
                if (*(u16 *)0x80197B60 & 0x8000) {
                    if (slot != 0) goto next_slot_1;
                }
                actor = (BattleRosterRecord *)((u8 *)D_801CE8BC + (roster_index * 0xF8 + 0x1C4));
                if (squad_source_index < 30) {
                    member_record = D_80193BC0 + member_index * 0x38;
                    special_member_pool = D_80190F80;
                } else {
                    member_record = D_80195560 + member_index * 0x34;
                    special_member_pool = D_801953F0;
                }
                position = *(float *)0x801976E0;
                token = remap_token(position, (slot + squad_source)[7], (double *)0x801D0610);
                member_index_arg = (slot + squad_source)[2];
                member_index_or_count = member_index_arg;
                if (member_index_or_count < 100) {
                    if ((HALF(member_record,0x18) != 0) | (selector != 0)) {
                        if (*(u8 *)0x801976DC < 30) {
                            COPY_ROW(actor, D_80193BC0 + member_index_or_count * 0x38, member_index_or_count);
                        } else {
                            battle_roster_init_actor_from_scenario_member(actor, member_index_arg);
                        }
                        if (!BYTE(D_801CE8BC,0x6084) && (actor->battle_flags & 2)) {
                            func_00023780(actor, 0xF8);
                            goto next_slot_1;
                        }
                        
                        actor->battle_flags &= ~0x500;
                        actor->formation_column = 2 - token_column(token);
                        actor->formation_row = 8 - token_row(token);
                        func_0020CBDC(actor, 0);
                        FIND_PEER(actor, 1);
                        
                        { int enabled; if (!actor) enabled = 0; else enabled = (actor->battle_flags >> 9) & 1; if (enabled && (func_00043dc4(actor->primary_class_id.bytes.low, actor->secondary_class_id.bytes.low) & 255) == 2) latch = 1; }
                    }
                } else {
                    if (auxiliary_value(member_index_or_count, special_member_pool)) {
                        if (*(u8 *)0x801976DC < 30) {
                            COPY_ROW(actor, D_80193BC0, 0);
                        } else {
                            battle_roster_init_actor_from_scenario_member(actor, 0);
                        }
                        if (!BYTE(D_801CE8BC,0x6084) && (actor->battle_flags & 2)) {
                            func_00023780(actor, 0xF8);
                            goto next_slot_1;
                        }
                        actor->battle_flags &= ~0x500;
                        actor->formation_column = 2 - token_column(token);
                        actor->formation_row = 8 - token_row(token);
                        actor->member_index = (slot + squad_source)[2];
                        actor->hp = auxiliary_value(actor->member_index, special_member_pool);
                        actor->max_hp = HALF(special_member_pool,2);
                        if (BYTE(special_member_pool + actor->member_index,0x90) & 4) actor->battle_flags |= 2;
                        func_0020CBDC(actor, latch);
                        FIND_PEER(actor, 1);
                    }
                }
                SUBMIT_POINTERS(actor);
                roster_index++;
                
            }
next_slot_1:
            slot++;
        }
    }

    member_index_or_count = 0;
    {
    int sortOffset;
    sortOffset = 0;
    actor_or_resource_index = 0;
    while (actor_or_resource_index < 20) {
        actor = scene_actor_ordinal(actor_or_resource_index + 1u, sortOffset);
        if (actor) {
            u32 key, shift; int context;
            int variant, flag10, flag8;
            variant = func_00045934(actor->equipment_slot_0, actor->equipment_slot_1, actor->equipment_slot_2, actor->equipment_slot_3) & 0xFFFF;
            flag8 = (actor->battle_flags >> 8) & 1;
            flag10 = (actor->battle_flags >> 10) & 1;
            for (index = 0; index < member_index_or_count; index++) {
                if (actor->primary_class_id.word == sources[index] && variant == variants[index] &&
                    flag10 == flag10s[index] && flag8 == flag8s[index]) break;
            }
            if (index < member_index_or_count) goto next_actor;
            {
                key = func_002015C8(actor->primary_class_id.word, actor->secondary_class_id.word, flag10, flag8);
                for (index = 0; index < member_index_or_count; index++) {
                    if (key < resources[index]) break;
                }
                for (shift = member_index_or_count; index < shift; shift--) {
                    sources[shift] = sources[shift - 1];
                    contexts[shift] = contexts[shift - 1];
                    resources[shift] = resources[shift - 1];
                    variants[shift] = variants[shift - 1];
                    flag10s[shift] = flag10s[shift - 1];
                    flag8s[shift] = flag8s[shift - 1];
                }
                sources[shift] = actor->primary_class_id.word;
                context = actor->secondary_class_id.word;
                member_index_or_count++;
                resources[shift] = key;
                variants[shift] = variant;
                flag10s[shift] = flag10;
                flag8s[shift] = flag8;
                contexts[shift] = context;
            }
        }
next_actor:
        actor_or_resource_index++;
        sortOffset += 0xF8;
    }
    }
    if (member_index_or_count) {
        actor_or_resource_index = 0;
        while (actor_or_resource_index < member_index_or_count) {
            u32 run = 1;
            /* Retail compares run with the total count even after actorIndex advances. */
            while (run < member_index_or_count && resources[actor_or_resource_index + run] == resources[actor_or_resource_index]) run++;
            func_00207658(sources + actor_or_resource_index, contexts + actor_or_resource_index, flag8s + actor_or_resource_index,
                          flag10s + actor_or_resource_index, variants + actor_or_resource_index, run);
            actor_or_resource_index += run;
        }
        func_002073CC(5, 0);
        func_0021088C();
        {
        int policyOffset; BattleRosterRecord *policyActor;
        member_index_or_count = 0;
        policyOffset = 0;
        do {
            policyActor = scene_actor(member_index_or_count, policyOffset);
            if (policyActor && !((policyActor->battle_flags >> 1) & 1) &&
                !func_0021062C(policyActor->primary_class_id.word, policyActor->secondary_class_id.word, 4)) {
                int side = battle_actor_is_side_zero(policyActor);
                u8 *status = &D_801976E8;
                if (side) status -= 0xC;
                if (status[1] & 2) {
                    policyActor->battle_flags |= 4;
                    func_0020FC7C(policyActor);
                }
            }
            member_index_or_count++;
            policyOffset += 0xF8;
        } while ((int)member_index_or_count < 20);
        }
        func_00210930();
        {
        int updateOffset; void *updateActor;
        actor_or_resource_index = 0;
        updateOffset = 0;
        do {
            updateActor = scene_actor(actor_or_resource_index, updateOffset);
            if (updateActor) {
                index = 0;
                do {
                    func_001F114C(updateActor);
                    index++;
                } while (index < 10);
            }
            actor_or_resource_index++;
            updateOffset += 0xF8;
        } while ((int)actor_or_resource_index < 20);
        }
    }
}
