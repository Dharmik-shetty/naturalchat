import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Message, Conversation } from "@shared/schema";

interface ChatMessage {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function useChat(characterId: number | null, userId: string | null) {
  const [isTyping, setIsTyping] = useState(false);
  const queryClient = useQueryClient();

  // Get or create conversation
  const { data: conversation } = useQuery({
    queryKey: ["/api/conversations", characterId, userId],
    queryFn: async () => {
      const response = await fetch(`/api/conversations/${characterId}/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch conversation');
      return response.json();
    },
    enabled: !!characterId && !!userId,
  });

  // Get messages for conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/messages", conversation?.id],
    queryFn: async () => {
      const response = await fetch(`/api/messages/${conversation?.id}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      return data.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    },
    enabled: !!conversation?.id,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, conversationId }: { content: string; conversationId: number }) => {
      const response = await apiRequest("POST", "/api/messages", {
        conversationId,
        content,
        isUser: true,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", conversation?.id] });
    },
  });

  // Generate AI response mutation
  const generateResponseMutation = useMutation({
    mutationFn: async ({ conversationId, characterId }: { conversationId: number; characterId: number }) => {
      const response = await apiRequest("POST", "/api/chat/generate", {
        conversationId,
        characterId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", conversation?.id] });
      setIsTyping(false);
    },
  });

  const sendMessage = useCallback(async (content: string) => {
    if (!conversation?.id || !characterId) return;

    try {
      // Send user message
      await sendMessageMutation.mutateAsync({
        content,
        conversationId: conversation.id,
      });

      // Show typing indicator
      setIsTyping(true);

      // Generate AI response
      setTimeout(async () => {
        await generateResponseMutation.mutateAsync({
          conversationId: conversation.id,
          characterId,
        });
      }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsTyping(false);
    }
  }, [conversation?.id, characterId, sendMessageMutation, generateResponseMutation]);

  return {
    messages,
    messagesLoading,
    isTyping,
    sendMessage,
    conversation,
    isLoading: sendMessageMutation.isPending || generateResponseMutation.isPending,
  };
}
