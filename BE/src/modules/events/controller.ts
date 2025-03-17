import { Request, Response } from "express";
import { prismaClient } from "../../db";
import generalResponse from "../../utlis/generalResponse";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, description, startDateTime, endDateTime, categories } =
      req.body;
    const event = await prismaClient?.event?.create({
      data: {
        name,
        description,
        startDateTime,
        endDateTime,
        categories: {
          create: categories?.map((categoryId: string) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
      },
    });
    if (!event) {
      return generalResponse(
        res,
        400,
        { success: false },
        "Event Could not be created. Try again",
        true
      );
    }

    return generalResponse(
      res,
      200,
      { success: true, event },
      "event added successfully",
      true
    );
  } catch (error) {
    console.log(error);
    return generalResponse(
      res,
      400,
      { success: false, error },
      "event did not added successfully",
      true
    );
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const { limit, offset, categories } = req.body;
    let whereClause: any = {}; // Initialize an empty where clause object

    if (categories && categories.length > 0) {
      // Check if categories is defined and not empty
      whereClause = {
        categories: {
          every: {
            categoryId: {
              in: categories,
            },
          },
        },
      };
    }
    const skip = (offset - 1) * limit;

    const events = await prismaClient.event.findMany({
      where: {
        deletedAt: null,
        AND: categories.map((categoryId: string) => ({
          categories: {
            some: {
              categoryId: categoryId,
            },
          },
        })),
      },

      include: {
        categories: {
          select: {
            category: true,
          },
        },
      },
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
    });

    const totalEvents = await prismaClient.event.count({
      where: {
        deletedAt: null,
        AND: categories.map((categoryId: string) => ({
          categories: {
            some: {
              categoryId: categoryId,
            },
          },
        })),
      },
    });
    const totalPages = Math.ceil(totalEvents / Number(limit));
    return generalResponse(
      res,
      200,
      {
        data: events || [],
        pagination: {
          currentPage: offset,
          totalPages,
          limit,
        },
      },
      "event fetched successfully",
      true,
      false
    );
  } catch (error) {
    console.warn(error);
    return generalResponse(
      res,
      400,
      { error },
      "event Could not be fetched",
      true
    );
  }
};

export const updateEvents = async (req: Request, res: Response) => {
  const { name, description, startDateTime, endDateTime, categories } =
    req.body;

  const { id } = req.params;

  if (!id) {
    return generalResponse(res, 400, {}, "Event id is required", true);
  }
  const eventExist = await prismaClient.event.count({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (eventExist === 0) {
    return generalResponse(res, 400, {}, "Event does not exist", true);
  }
  const event = await prismaClient?.event?.update({
    where: { id },
    data: {
      name,
      description,
      startDateTime,
      endDateTime,
      categories: {
        deleteMany: {},
        create: categories?.map((categoryId: string) => ({
          category: {
            connect: { id: categoryId },
          },
        })),
      },
    },
  });
  if (!event) {
    return generalResponse(
      res,
      400,
      { success: false },
      "event could not be created. Try again",
      true
    );
  }

  return generalResponse(
    res,
    200,
    { success: true, event },
    "event updated successfully",
    true
  );
};

export const deleteEvents = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return generalResponse(res, 400, {}, "Event id is required", true);
    }
    const eventExist = await prismaClient.event.count({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (eventExist === 0) {
      return generalResponse(res, 400, {}, "Event does not exist", true);
    }
    const event = await prismaClient?.event?.update({
      where: { id, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });
    if (!event) {
      return generalResponse(
        res,
        400,
        { success: false },
        "event could not be delete. Try again",
        true
      );
    }

    return generalResponse(
      res,
      200,
      { success: true, event },
      "event deleted successfully",
      true
    );
  } catch (error) {
    return generalResponse(
      res,
      400,
      { success: false, error },
      "Could not delete event",
      true
    );
  }
};

export const seedCategories = async (req: Request, res: Response) => {
  try {
    const eventManagementCategories = [
      "Corporate Events",
      "Social Events",
      "Cultural Events",
      "Educational Events",
      "Sports Events",
      "Entertainment Events",
      "Charity and Fundraising Events",
      "Exhibitions and Trade Shows",
      "Political Events",
      "Virtual Events",
    ];

    const payload = eventManagementCategories?.map((category) => ({
      name: category,
    }));

    const categories = await prismaClient?.category.createMany({
      data: payload,
    });

    if (categories.count <= 0) {
      return generalResponse(
        res,
        400,
        { success: false },
        "Could not seed categories",
        true
      );
    }
    return generalResponse(
      res,
      200,
      { success: true, categories },
      "seed categories successfully",
      true
    );
  } catch (error) {
    return generalResponse(
      res,
      400,
      { success: false, error },
      "Could not seed categories",
      true
    );
  }
};
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prismaClient?.category.findMany({
      select: { id: true, name: true },
    });

    return generalResponse(
      res,
      200,
      categories,
      "seed categories successfully",
      true,
      true
    );
  } catch (error) {
    return generalResponse(
      res,
      400,
      { success: false, error },
      "Could not fetch categories",
      true
    );
  }
};

export const seedEvents = async (req: Request, res: Response) => {
  try {
    const { length } = req.body;

    if (!length) {
      return generalResponse(
        res,
        400,
        { success: false },
        "invalid length",
        true
      );
    }
    const categories = await prismaClient?.category.findMany({
      select: { id: true },
    });

    const randomCategoryLength = Math.ceil(
      (Math.random() || 0.2) * categories?.length
    );

    const randomCategories = categories
      ?.map((category) => category.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, randomCategoryLength);
    const eventPromise: Promise<any>[] = [];

    for (let i = 0; i < length; i++) {
      const startDateTime = new Date();
      const endDateTime = new Date(
        startDateTime.getTime() + Math.ceil(Math.random() * 5) * 60 * 60 * 1000 // Add up to 5 hours
      );

      eventPromise.push(
        prismaClient.event.create({
          data: {
            name: `Event ${i + 1} in ${randomCategoryLength} category`,
            description: `Event ${i + 1} in ${randomCategoryLength} category`,
            startDateTime,
            endDateTime,
            categories: {
              create: randomCategories?.map((categoryId: string) => ({
                category: {
                  connect: { id: categoryId },
                },
              })),
            },
          },
        })
      );
    }

    // Function to process events in batches
    const processInBatches = async (batchSize: number) => {
      for (let i = 0; i < eventPromise.length; i += batchSize) {
        const batch = eventPromise.slice(i, i + batchSize);
        await Promise.all(batch); // Execute batch of promises concurrently
      }
    };

    // Call function with batch size of 15
    await processInBatches(15);

    return generalResponse(
      res,
      200,
      categories,
      "seed categories successfully",
      true,
      true
    );
  } catch (error) {
    return generalResponse(
      res,
      400,
      { success: false, error },
      "Could not fetch categories",
      true
    );
  }
};
