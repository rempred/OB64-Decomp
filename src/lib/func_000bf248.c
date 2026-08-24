typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;

s32 func_000bedb8(u8, s16);
extern u8 D_801EF288[];

void func_000bf248(void)
{
    s32 candidate_class;
    register s32 mode_copy asm("$5");
    register s32 output_count asm("$19");
    register s32 mode asm("$20");
    register s32 disable_without_check asm("$21");
    register s32 is_mode_two asm("$22");
    s32 mode_value;
    register s32 table_offset asm("$3");
    s32 eligibility_byte;
    register s32 entry_index asm("$16");
    register s32 output_offset asm("$17");
    s32 selected_mode;
    register s32 entry_mode asm("$2");
    s32 rounded_entry_index;
    register u16 *table_cursor asm("$18");
    register u16 table_entry asm("$4");
    register s32 loop_sentinel asm("$2");
    register s32 next_entry_value asm("$3");
    u8 selected_class;
    register u8 *final_data asm("$2");
    register u8 *zero_mode_data asm("$2");
    register s32 zero_mode_offset asm("$4");
    register u16 zero_mode_class asm("$3");
    register s32 final_output_offset asm("$3");
    register u8 *data asm("$3");

    selected_class = (*(u8 **)0x80196AF8)[0x5E9];
    output_count = 0;
    entry_index = 0;
    if (selected_class >= 0x51U) {
        selected_mode = 0;
    } else {
        selected_mode = D_801EF288[0x44 + (selected_class * 2)] & 0xF;
    }
    mode_value = selected_mode & 0xFFFF;
    mode_copy = mode_value;
    if (mode_value == 0) {
        zero_mode_data = *(u8 **)0x80196AF8;
        zero_mode_offset = output_count * 2;
        zero_mode_class = *(u16 *)(zero_mode_data + 0x5E8);
        output_count += 1;
        zero_mode_data += zero_mode_offset;
        zero_mode_class |= 0x80;
        *(s16 *)(zero_mode_data + 0x1C0E) = zero_mode_class;
    } else {
        table_offset = entry_index * 2;
        asm volatile(
            "# Hybrid scope: these three instructions materialize the entry-table base and form its first cursor.\n"
            "# $v0 receives D_801EF288 + 0x44, then adds the C-computed byte offset in $v1 into $s2.\n"
            "# KMC otherwise folds the address directly into $s2; the C load and cursor increment remain generated.\n"
            "lui $2,%%hi(D_801EF288+0x44)\n"
            "addiu $2,$2,%%lo(D_801EF288+0x44)\n"
            "addu %0,%1,$2\n"
            : "=r" (table_cursor) : "r" (table_offset) : "$2");
        table_entry = *table_cursor;
        asm volatile(
            "# Hybrid scope: these two instructions prepare the first sentinel comparison.\n"
            "# $v0 receives 0xFFFF and $v1 explicitly zero-extends the first 16-bit table entry from $a0.\n"
            "# KMC recognizes the C value as already unsigned-short and deletes retail's deliberate `andi`.\n"
            "ori %0,$0,0xFFFF\n"
            "andi %1,%2,0xFFFF\n"
            : "=r" (loop_sentinel), "=r" (next_entry_value)
            : "r" (table_entry));
        table_cursor += 1;
        if (next_entry_value != loop_sentinel) {
            asm("# Hybrid scope: this `andi` copies the masked mode from $a1 to long-lived $s4.\n"
                "# KMC otherwise coalesces the already-masked value into a `move`; all mode tests remain C.\n"
                "andi %0,%1,0xFFFF\n"
                : "=r" (mode) : "r" (mode_copy));
            asm(
                "# Hybrid scope: these eight instructions precompute two loop-invariant mode flags.\n"
                "# $s6 becomes (mode == 2). $s5 becomes ((unsigned)(mode - 1) >= 2) && (mode != 5).\n"
                "# Retail keeps both flags across the C loop; KMC otherwise recomputes part of the second condition.\n"
                "xori $2,%2,2\n"
                "sltiu %0,$2,1\n"
                "addiu $3,%3,-1\n"
                "sltiu $3,$3,2\n"
                "xori $3,$3,1\n"
                "xori $2,%2,5\n"
                "sltu $2,$0,$2\n"
                "and %1,$3,$2\n"
                : "=r" (is_mode_two), "=r" (disable_without_check)
                : "r" (mode), "r" (mode_copy)
                : "$2", "$3");
            output_offset = output_count * 2;
            do {
                entry_mode = (table_entry >> 8) & 0xF;
                asm volatile(
                    "# Hybrid scope: this 17-instruction cluster implements only the special entry-mode filter.\n"
                    "# Inputs are entry mode in $v0, selected mode in $s4, entry index in $s0, and (mode == 2) in $s6.\n"
                    "# A matching entry mode accepts immediately. Mode 1 additionally accepts indices 0x26 and 0x2B.\n"
                    "# Mode 2 accepts index 0x26; every other case branches to the rejected-entry loop path.\n"
                    "# Retail recomputes both equality tests and uses the first result in branch delay slots.\n"
                    "# KMC removes that redundancy and rewrites the final conjunction, so ordinary C cannot retain this exact schedule.\n"
                    ".set noreorder\n"
                    "beq %0,%1,.Lbf248_filter_passed\n"
                    "addiu $2,$0,1\n"
                    "bne %1,$2,.Lbf248_mode_shared\n"
                    "xori $2,%2,0x26\n"
                    "xori $3,%2,0x26\n"
                    "sltiu $3,$3,1\n"
                    "xori $2,%2,0x2B\n"
                    "sltiu $2,$2,1\n"
                    "or $3,$3,$2\n"
                    "bne $3,$0,.Lbf248_filter_passed\n"
                    "addiu $2,$0,0x2B\n"
                    "beq %2,$2,.Lbf248_filter_passed\n"
                    "xori $2,%2,0x26\n"
                    ".Lbf248_mode_shared:\n"
                    "sltiu $2,$2,1\n"
                    "and $2,%3,$2\n"
                    "beq $2,$0,.Lbf248_filter_failed\n"
                    "nop\n"
                    ".set reorder\n"
                    : "=r" (entry_mode)
                    : "r" (mode), "r" (entry_index),
                      "r" (is_mode_two), "0" (entry_mode)
                    : "$3");
                asm volatile(".Lbf248_filter_passed:");
                    rounded_entry_index = entry_index;
                    if (entry_index < 0) {
                        rounded_entry_index = entry_index + 7;
                    }
                    eligibility_byte = rounded_entry_index >> 3;
                    candidate_class = entry_index & 0xFF;
                    if ((*(u8 *)(eligibility_byte + 0x80196A76) &
                         *(u8 *)((entry_index - (eligibility_byte * 8)) + 0x801EF370)) != 0) {
                        asm volatile(
                            "# Hybrid scope: these two instructions reload the global data pointer into $v1.\n"
                            "# KMC hoists the absolute address into an extra saved register under loop pressure; retail reloads it here.\n"
                            "lui %0,0x8019\n"
                            "lw %0,0x6AF8(%0)\n"
                            : "=r" (data));
                        *(s16 *)(data + output_offset + 0x1C0E) = candidate_class;
                        if (*(u16 *)(data + 0x5E8) == candidate_class) {
                            goto mark_unavailable;
                        }
                        if (disable_without_check) {
                            goto mark_unavailable;
                        }
                        if (func_000bedb8(*(u8 *)(data + 0x18B),
                                          candidate_class) & 0xFF) {
                            goto accepted_entry_done;
                        }
mark_unavailable:
                            asm volatile(
                                "# Hybrid scope: these two instructions repeat retail's global-pointer reload into $v1.\n"
                                "# The following C addition, load, OR, and store mark this output entry unavailable.\n"
                                "lui %0,0x8019\n"
                                "lw %0,0x6AF8(%0)\n"
                                : "=r" (data));
                            data += output_offset;
                            *(u16 *)(data + 0x1C0E) =
                                *(u16 *)(data + 0x1C0E) | 0x80;
accepted_entry_done:
                        output_offset += 2;
                        output_count += 1;
                    }
                asm volatile(".Lbf248_filter_failed:");
                table_entry = *table_cursor;
                entry_index += 1;
                asm volatile(
                    "# Hybrid scope: these two instructions prepare the sentinel loop comparison.\n"
                    "# $v0 receives 0xFFFF and $v1 receives the zero-extended 16-bit table entry from $a0.\n"
                    "# The following C loop condition emits the retail `bne`; this prevents KMC from hoisting 0xFFFF into $s7.\n"
                    "ori %0,$0,0xFFFF\n"
                    "andi %1,%2,0xFFFF\n"
                    : "=r" (loop_sentinel), "=r" (next_entry_value)
                    : "r" (table_entry));
                table_cursor += 1;
            } while (next_entry_value != loop_sentinel);
        }
    }
    final_data = *(u8 **)0x80196AF8;
    final_output_offset = output_count * 2;
    *(s16 *)(final_data + 0x1BFC) = output_count;
    final_data += final_output_offset;
    *(s16 *)(final_data + 0x1C0E) = 0;
}
