typedef struct ListNode {
    struct ListNode *next;
} ListNode;

asm(
    ".macro move rd,rs\n"
    "addu \\rd,\\rs,$0\n"
    ".endm\n");

void func_00025000(ListNode **head, ListNode *target)
{
    ListNode **cursor;
    ListNode *current;

    cursor = head;
    current = *cursor;
    while (current != 0) {
        if (current == target) {
            *cursor = current->next;
            return;
        }
        cursor = &current->next;
        current = *cursor;
    }
}

asm(
    ".align 4\n"
    ".size func_00025000,64\n");
