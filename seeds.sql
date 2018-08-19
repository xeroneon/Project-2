-- Insert some sample cards
INSERT INTO `project2`.`cards` (`card_id`, `card_name`, `createdAt`, `updatedAt`) VALUES ('1', 'Test Card', '2018-08-19 17:13:01', '2018-08-19 17:13:01');
INSERT INTO `project2`.`cards` (`card_id`, `card_name`, `createdAt`, `updatedAt`) VALUES ('2', 'Another Test Card', '2018-08-19 17:13:34', '2018-08-19 17:13:34');
INSERT INTO `project2`.`cards` (`card_id`, `card_name`, `createdAt`, `updatedAt`) VALUES ('3', 'One More Test Card', '2018-08-19 17:22:47', '2018-08-19 17:22:47');
-- Insert a sample user whose password is password123
INSERT INTO `project2`.`users` (`user_id`, `user_email`, `user_password`, `user_name`, `user_first_name`, `user_last_name`, `createdAt`, `updatedAt`) VALUES ('1', 'testing@test.com', '$2b$10$Sl3JyB/YU/4SuHyJIDoOfempiqksSwOIGjFoIhSSHqzHQESxpFIO2', 'testing', 'Max', 'password123', '2018-08-19 16:53:34', '2018-08-19 16:53:34');