import { prisma } from "@formbricks/database";
import { TBaseFilterGroup, TUserSegmentUpdateInput } from "@formbricks/types/v1/userSegment";

export const createUserSegment = async (
  environmentId: string,
  surveyId: string,
  title: string,
  description: string,
  isPrivate: boolean,
  filters: TBaseFilterGroup
) => {
  const userSegment = await prisma.userSegment.create({
    data: {
      environmentId,
      title,
      description,
      isPrivate,
      filters,
      surveys: {
        connect: {
          id: surveyId,
        },
      },
    },
  });

  return userSegment;
};

export const getAllUserSegments = async (environmentId: string) => {
  const userSegments = await prisma.userSegment.findMany({
    where: {
      environmentId,
    },
  });

  return userSegments;
};

export const getUserSegment = async (userSegmentId: string) => {
  const userSegment = await prisma.userSegment.findUnique({
    where: {
      id: userSegmentId,
    },
  });

  return userSegment;
};

export const updateUserSegment = async (segmentId: string, data: TUserSegmentUpdateInput) => {
  const userSegment = await prisma.userSegment.update({
    where: {
      id: segmentId,
    },
    data,
  });

  return userSegment;
};

export const loadNewUserSegment = async (surveyId: string, newSegmentId: string) => {
  const userSegment = await prisma.userSegment.findUnique({
    where: {
      id: newSegmentId,
    },
    include: {
      surveys: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!userSegment) {
    throw new Error("User segment not found");
  }

  const updatedSurvey = await prisma.survey.update({
    where: {
      id: surveyId,
    },
    data: {
      userSegment: {
        connect: {
          id: newSegmentId,
        },
      },
    },
  });

  return {
    userSegment,
    updatedSurvey,
  };
};
