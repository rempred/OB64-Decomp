#ifndef OB64_GAME_BOOT_ARCHIVE_RECORD_H
#define OB64_GAME_BOOT_ARCHIVE_RECORD_H

#include "game/boot_archive_stream.h"

/* Layout written by the retail archive record decoder. */
typedef struct ResourceRecord {
    u8 byte00;
    u8 bytes01[5];
    u8 unknown06[2];
    u32 word08;
    u32 word0C;
    u32 word10;
    u8 byte14;
    u8 byte15;
    u8 bytes16[0x100];
    u16 half116;
    u32 word118;
    u8 byte11C;
    u8 byte11D;
    u8 unknown11E[2];
    u32 word120;
    u16 half124;
    u16 half126;
    u16 half128;
    u8 unknown12A[2];
} ResourceRecord;

/* Keep the retail callers' 0x130-byte allocation and word alignment. */
typedef union {
    ResourceRecord record;
    u8 bytes[0x130];
} ResourceRecordScratch;

s32 func_0000B3E4(ArcFile *input, ResourceRecord *record);

/* The archive loader consumes an input descriptor and writes separate requests. */
typedef struct ResourceArchiveInput {
    u32 field_00;
    u32 field_04;
    u8 *buffer;
    u32 size;
} ResourceArchiveInput;

typedef struct ResourceArchiveRequest {
    const u8 *name;
    s32 record_index;
    u8 *buffer;
    u32 size;
} ResourceArchiveRequest;

/* The assembly-owned templates supply the initial words for either view. */
typedef union ResourceArchiveTemplate {
    ResourceArchiveInput input;
    ResourceArchiveRequest request;
} ResourceArchiveTemplate;

u32 func_0000B29C(ResourceArchiveInput *input);
void boot_resource_archive_load_many(ResourceArchiveInput *input,
                                    ResourceArchiveRequest *requests, s32 count);
void func_8007ACB0(ResourceArchiveInput *input,
                   ResourceArchiveRequest *requests, s32 count);
void func_0000BFF4(const u8 *name, const u8 *message);

/* Only the insertion helper uses these links at +0x10 and +0x14. */
typedef struct ContextNode24 {
    u32 field_00;
    void *field_04;
    u32 field_08;
    u32 field_0C;
    struct ContextNode24 *field_10;
    struct ContextNode24 *field_14;
} ContextNode24;

/* The command tree allocates 0x1C bytes per node. Its payload can be
 * an archive buffer or a table of resource keys. */
typedef struct ResourceNode28 {
    u32 field_00;
    void *field_04;
    u32 field_08;
    ContextNode24 *field_0C;
    struct ResourceNode28 *field_10;
    struct ResourceNode28 *field_14;
    struct ResourceNode28 *field_18;
} ResourceNode28;

extern ContextNode24 *g_boot_resource_context;

ResourceNode28 *boot_resource_node_insert_find(ResourceNode28 *node, u32 key);
ResourceNode28 *boot_resource_node_payload_materialize(ResourceNode28 *node);

void boot_resource_node_context_materialize(ResourceNode28 *node, u32 mode);
void boot_resource_node_overlay_context_materialize(ResourceNode28 *node);
void func_00009EFC(ResourceNode28 *node);

ContextNode24 *boot_resource_node_recursive_insert_slot_search(ContextNode24 *node, u32 key);
ContextNode24 *func_00009CB4(ContextNode24 *node, u32 key);

#endif
